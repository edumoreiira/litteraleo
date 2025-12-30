import Quill from 'quill';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

// --- FONT CONFIGURATION ---
// 1. Get the Font format (class-based)
const Font = Quill.import('formats/font') as any;

// 2. Define your font whitelist (keys used in CSS classes)
// We use lowercase/hyphenated names for cleaner CSS classes
const fontsArr = [
  'source-serif-4',
  'inter',
  'abril-fatface',
  'geist',
  'lora',
  'outfit',
  'roboto',
];

// 3. Register the whitelist
Font.whitelist = fontsArr;
Quill.register(Font, true);

// --- SIZE CONFIGURATION ---
// 1. Define your custom sizes
const fontSizeArr = ['10px', '12px', '14px', '16px', false, '24px', '32px'];

// 2. Get the existing Size style attributer
const Size = Quill.import('attributors/style/size') as any;

// 3. Whitelist your custom sizes
Size.whitelist = fontSizeArr;

// 4. Register the modified attributer
Quill.register(Size, true);

// --- MODULE REGISTRATION ---
Quill.register('modules/blotFormatter2', BlotFormatter);

export const EDITOR_MODULES = {
  toolbar: [
    // Add the font dropdown to the toolbar
    [{ 'font': fontsArr }, { 'size': fontSizeArr }], 
    
    ['bold', 'italic', 'underline'],
    [{ 'background': [] }, { 'color': [] }],
    [{ 'align': [] }],
    ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  // blotformatter2 configuration
  blotFormatter2: {
    resize: {
      allowResizing: true,
      useRelativeSize: true, 
      allowResizeModeChange: true, 
    },
    align: {
      allowAligning: true,
    },
    image: {
      allowAltTitleEdit: true,
      registerImageTitleBlot: true,
      allowCompressor: true,
      compressorOptions: {
        jpegQuality: 1, 
        maxWidth: 1000
      }
    },
  }
};