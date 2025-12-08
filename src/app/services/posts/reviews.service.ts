import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../ui/toast.service';
import { PostgrestError } from '@supabase/supabase-js';
import { Book, BooksAndCategories, CreateReviewDTO, PaginatedReviews, Review, ReviewCategory, ReviewSearchParams } from 'app/models/review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  // 
  private booksAndCategories = signal<BooksAndCategories | null>(null);
  $booksAndCategories = this.booksAndCategories.asReadonly();


  public async updateBooksAndCategories() {
    const { data, error } = await this.getAllBooksAndCategories();
    if (error) throw error;
    this.booksAndCategories.set(data);
    return data;
  }

  // --- CRUD ---
  // --- REVIEWS ---

  public async searchReviews(params: ReviewSearchParams)
  : Promise<{ data: PaginatedReviews; error: PostgrestError | null }>
  {
    const { 
      search_text, 
      rating, 
      category_ids, 
      page = 1, 
      page_size = 8 
    } = params;
  
    const { data, error } = await this.supabase
      .rpc('search_reviews', {
        r_search_text: search_text ?? null,  
        r_rating: rating ?? null,
        r_category_ids: category_ids ?? null,
        r_page : page ?? null,
        r_page_size : page_size ?? null
      });
    
    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao buscar as reviews.',
      });
      console.error('Erro ao buscar reviews:', error);
      throw error;
    }
    return { data, error }
  }

  public async getAllBooksAndCategories()
  : Promise<{ data: BooksAndCategories; error: PostgrestError | null }>
  {
    const { data, error } = await this.supabase.rpc('get_books_and_categories');
    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao buscar os livros e categorias.',
      });
      console.error('Erro ao buscar livros e categorias:', error);
      throw error;
    }
    return { data, error }
  }

  public async createReview(dto: CreateReviewDTO) {
   const { data, error } = await this.supabase
     .rpc('create_review', {
       p_title: dto.title,
       p_content: dto.content,
       p_rating: dto.rating,
       p_book_id: dto.book_id,
       p_author_id: this.auth.$userId(),
       p_category_ids: dto.category_ids,
     });

   if (error) {
     console.error('Erro ao criar review:', error);
     throw error;
   }
   
   this.toast.create({
     variant: 'success',
     message: 'Resenha criada com sucesso!',
   });

   return data; // Retorna o objeto da review criada
  }

  public async getReviewBySlug(slug: string) {
    const { data, error } = await this.supabase
    .rpc('get_review_by_slug', { p_slug: slug })

    return { data: data as Review, error}
  }

  // --- BOOKS ---

  public async createBook(bookData: Partial<Book>, bookCover: File)
  : Promise<Book> {
    let uploadedPath: string | null = null;

    try {
      // 1. PREPARAR O UPLOAD
      // Dica: Use timestamp para garantir nome único
      const fileExt = bookCover.name.split('.').pop();
      const fileName = `${Date.now()}_${bookData.title?.replace(/\s/g, '-')}.${fileExt}`;
      // Se quiser salvar na raiz, use apenas fileName. Se quiser pasta, use `covers/${fileName}`
      const filePath = fileName; 

      // 2. TENTAR UPLOAD (Passo A)
      const { error: uploadError } = await this.supabase.storage
        .from('book-covers')
        .upload(filePath, bookCover);

      if (uploadError) throw uploadError;

      // Marcamos que o upload deu certo para poder deletar depois caso precise
      uploadedPath = filePath;

      // 3. OBTER URL PÚBLICA
      const { data: urlData } = this.supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      // 4. TENTAR INSERIR NO BANCO (Passo B)
      const { data, error: insertError } = await this.supabase
        .from('books')
        .insert({
          ...bookData,
          cover_image_url: urlData.publicUrl,
        })
        .select()
        .single();

      if (insertError) {
        // O BANCO FALHOU! -> Disparar erro para cair no catch
        throw insertError; 
      }

      // SUCESSO TOTAL
      this.toast.create({
        variant: 'success',
        message: 'Livro criado com sucesso!',
      });
      return data as Book;

    } catch (error) {
      // 5. ROLLBACK MANUAL (A Mágica da Transação)
      // Se chegamos aqui e temos um caminho de upload, significa que a imagem subiu,
      // mas o banco falhou. Então, deletamos a imagem imediatamente.
      if (uploadedPath) {
        console.warn('Rollback: Deletando imagem órfã devido a erro no banco...');
        await this.supabase.storage
          .from('book-covers')
          .remove([uploadedPath]);
      }

      console.error('Falha na criação do livro:', error, uploadedPath);
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao criar o livro.',
      });
      throw error;
    }
  }

  public async updateBook(
    bookData: Partial<Book>,
    bookCover?: File | null
  ): Promise<Book> {
    let uploadedPath: string | null = null;
    let oldCoverUrl: string | null = null;

    try {
      // 1. SE TIVER NOVA IMAGEM, PRECISAMOS SABER A URL DA ANTIGA
      if (bookCover) {
        // Buscamos o registro atual no banco para guardar a URL antiga
        const { data: currentBook, error: fetchError } = await this.supabase
          .from('books')
          .select('cover_image_url')
          .eq('id', bookData.id)
          .single();

        if (fetchError) throw fetchError;
        oldCoverUrl = currentBook?.cover_image_url; // Guardamos para deletar no final
      }

      // Copia dos dados para edição
      const updates = { ...bookData };

      // 2. LÓGICA DE UPLOAD (Igual à anterior)
      if (bookCover) {
        const fileExt = bookCover.name.split('.').pop();
        const safeTitle = (bookData.title || 'updated-book').replace(/\s/g, '-');
        const fileName = `${Date.now()}_${safeTitle}.${fileExt}`;
        const filePath = fileName;

        // A. Upload
        const { error: uploadError } = await this.supabase.storage
          .from('book-covers')
          .upload(filePath, bookCover);

        if (uploadError) throw uploadError;

        uploadedPath = filePath; // Marcado para Rollback se necessário

        // B. Get URL
        const { data: urlData } = this.supabase.storage
          .from('book-covers')
          .getPublicUrl(filePath);

        updates.cover_image_url = urlData.publicUrl;
      }

      // 3. ATUALIZAR O BANCO
      const { data, error: updateError } = await this.supabase
        .from('books')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // 4. LIMPEZA: DELETAR A IMAGEM ANTIGA (Somente se chegamos aqui com sucesso)
      if (bookCover && oldCoverUrl) {
        const oldPath = this.extractPathFromUrl(oldCoverUrl);
        if (oldPath) {
          console.log('Deletando imagem antiga:', oldPath);
          // Não precisamos de 'await' aqui se não quisermos travar a UI, 
          // pode ser "fire and forget", mas await é mais seguro para debug.
          await this.supabase.storage
            .from('book-covers')
            .remove([oldPath]);
        }
      }

      // SUCESSO
      this.toast.create({
        variant: 'success',
        message: 'Livro atualizado com sucesso!',
      });
      return data as Book;

    } catch (error) {
      // ROLLBACK DA NOVA IMAGEM
      // Se o banco falhou, deletamos a imagem NOVA que acabamos de subir
      if (uploadedPath) {
        console.warn('Rollback: Deletando nova imagem devido a erro...');
        await this.supabase.storage
          .from('book-covers')
          .remove([uploadedPath]);
      }

      console.error('Erro no update:', error);
      this.toast.create({
        variant: 'error',
        message: 'Erro ao atualizar.',
      });
      throw error;
    }
  }

  public async deleteBook(bookId: string | number) {
    try {
      // 1. RECUPERAR A URL DA IMAGEM ANTES DE DELETAR
      // Precisamos saber qual arquivo apagar.
      const { data: book, error: fetchError } = await this.supabase
        .from('books')
        .select('cover_image_url')
        .eq('id', bookId)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar livro para deleção:', fetchError);
        throw fetchError;
      }

      // 2. DELETAR O REGISTRO DO BANCO DE DADOS
      const { error: deleteError } = await this.supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (deleteError) throw deleteError;

      // 3. LIMPEZA: DELETAR A IMAGEM DO STORAGE
      // Só executamos isso se o passo 2 funcionou.
      if (book?.cover_image_url) {
        const path = this.extractPathFromUrl(book.cover_image_url);
        
        if (path) {
          console.log('Removendo imagem associada:', path);
          const { error: storageError } = await this.supabase.storage
            .from('book-covers')
            .remove([path]);

          if (storageError) {
            // Não jogamos throw aqui, apenas logamos. 
            // O livro já foi deletado do banco, então para o usuário a operação foi um sucesso.
            // O pior caso aqui é sobrar um arquivo órfão no bucket.
            console.warn('Aviso: Livro deletado, mas falha ao remover imagem:', storageError);
          }
        }
      }

      this.toast.create({
        variant: 'success',
        message: 'Livro removido com sucesso!',
      });

    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      this.toast.create({
        variant: 'error',
        message: 'Erro ao deletar o livro.',
      });
      throw error;
    }
  }

  // --- CATEGORIES ---

  async createCategory(payload: Pick<ReviewCategory, 'name'>): Promise<ReviewCategory> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert(payload)
      .select()
      .single();

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao criar a categoria.',
      });
      // Postgres error code 23505 is for unique violation
      if (error.code === '23505') {
        throw new Error('A category with this name already exists.');
      }
      throw error;
    }
    this.toast.create({
      variant: 'success',
      message: 'Categoria criada com sucesso!',
    });
    return data as ReviewCategory;
  }

  async updateCategory(category: ReviewCategory): Promise<ReviewCategory> {
    const { data, error } = await this.supabase
      .from('categories')
      .update({ name: category.name })
      .eq('id', category.id)
      .select()
      .single();

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao atualizar a categoria.',
      });
      // Postgres error code 23505 is for unique violation
      if (error.code === '23505') {
        throw new Error('A category with this name already exists.');
      }
      throw error;
    }

    this.toast.create({
      variant: 'success',
      message: 'Categoria atualizada com sucesso!',
    });
    return data as ReviewCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      this.toast.create({
        variant: 'error',
        message: 'Ocorreu um erro ao deletar a categoria.',
      });
      throw error;
    }
    this.toast.create({
      variant: 'success',
      message: 'Categoria deletada com sucesso!',
    });
  }


  // --- MÉTODOS AUXILIARES ---

  /**
   * Transforma a URL completa:
   * "https://xyz.supabase.co/.../public/book-covers/123_teste.jpg"
   * Em path relativo:
   * "123_teste.jpg"
   */
  private extractPathFromUrl(url: string): string | null {
    const bucketName = 'book-covers';
    if (!url || !url.includes(bucketName)) return null;

    // Divide a URL pelo nome do bucket
    // O Supabase gera urls assim: .../storage/v1/object/public/book-covers/NOME_DO_ARQUIVO
    const parts = url.split(`/${bucketName}/`);
    
    if (parts.length === 2) {
      // Decodifica URI components para garantir que espaços e caracteres especiais sejam tratados
      return decodeURIComponent(parts[1]);
    }
    
    return null;
  }


}