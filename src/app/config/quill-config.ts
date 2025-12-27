import Quill from 'quill';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

// 1. Define your custom sizes
const fontSizeArr = ['10px', '12px', false, '16px', '20px', '24px', '32px'];

// 2. Get the existing Size style attributer
const Size = Quill.import('attributors/style/size') as any;

// 3. Whitelist your custom sizes
Size.whitelist = fontSizeArr;

// 4. Register the modified attributer
Quill.register(Size, true);
// register the module with quill before exporting the config
// formatting functionality relies on this registration
Quill.register('modules/blotFormatter2', BlotFormatter);

export const EDITOR_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'background': [] }, { 'color': [] }],
    [{ 'align': [] }, { 'size': fontSizeArr }],
    ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  // blotformatter2 configuration
  blotFormatter2: {
    resize: {
      allowResizing: true,
      useRelativeSize: true, // uses % instead of px
      allowResizeModeChange: true, // allows switching between % and px
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


// export const  EDITOR_MODULES = {
//     toolbar: [
//       ['bold', 'italic', 'underline'],
//       [{ 'background': [] }, { 'color': [] }],
//       [{ 'align': [] }, { 'header': [1, 2, 3, false] }],
//       ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
//       ['link', 'image'],
//       ['clean'], // remove formatting
//     ]
//   };