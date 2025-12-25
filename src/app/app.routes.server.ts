import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'editar-post/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'editar-resenha/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'resenha/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'post/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
