<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable space-before-blocks -->
<!-- eslint-disable import/no-extraneous-dependencies -->
<script lang="ts" setup>
import { Alignment } from '@ckeditor/ckeditor5-alignment'; // Importing the package.
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { ExportPdf } from '@ckeditor/ckeditor5-export-pdf';
import { ImportWord } from '@ckeditor/ckeditor5-import-word';
import { ExportWord } from '@ckeditor/ckeditor5-export-word';
import { Font, FontFamily } from '@ckeditor/ckeditor5-font';
import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from '@ckeditor/ckeditor5-image';
import { useField } from 'vee-validate';
import UploadFile from '@/utils/uploadFile';

// eslint-disable-next-line
function MyUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = function (
    loader: any,
  ) {
    return new UploadFile(loader);
  };
}

const emit = defineEmits(['modalChange']);
const editor = ClassicEditor;
const editorConfig = {
  extraPlugins: [MyUploadAdapterPlugin],
  plugins: [
    Alignment, // Adding the package to the list of plugins.
    Autoformat,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    SourceEditing,
    ExportPdf,
    Font,
    FontFamily,
    Underline,
    ImportWord,
    ExportWord,
  ],

  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'link',
      'subscript',
      'superscript',
      '|',
      'fontSize',
      'fontFamily',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bulletedList',
      'numberedList',
      'alignment',
      '|',
      'imageUpload',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'exportPdf',
      'importWord',
      'exportWord',
      'sourceEditing',
    ],
    exportPdf: {
      tokenUrl: 'https://example.com/cs-token-endpoint',
      stylesheets: [
        './path/to/fonts.css',
        'EDITOR_STYLES',
        './path/to/style.css',
      ],
      fileName: 'my-file.pdf',
      converterOptions: {
        format: 'A4',
        margin_top: '20mm',
        margin_bottom: '20mm',
        margin_right: '12mm',
        margin_left: '12mm',
        page_orientation: 'portrait',
      },
      fontSize: {
        options: ['tiny', 'default', 'big'],
      },
    },
    importWord: {
      formatting: {
        resets: 'none',
        defaults: 'none',
        styles: 'inline',
      },
    },
    exportWord: {
      tokenUrl: 'https://example.com/cs-token-endpoint',
      fileName: 'my-file.docx',
      converterOptions: {
        format: 'A4', // Default value, you don't need to specify it explicitly for A4.
        margin_top: '20mm',
        margin_bottom: '20mm',
        margin_right: '12mm',
        margin_left: '12mm',
      },
    },
  },
};
const props = withDefaults(
  defineProps<{
    name: string;
    pt?: any;
    show?: true;
    placeholder?: string;
    css_height?: string;
    disabled?: boolean;
    id?: string;
  }>(),
  {
    disabled: false,
  },
);
const { value, errorMessage } = useField<string>(props.name);
</script>
<template>
  <div :class="disabled ? 'disable' : ''">
    <div :class="`${errorMessage ? 'textBox' : ''}`">
      <ckeditor
        :placeholder="placeholder"
        :id="id + 'field'"
        :editor="editor"
        v-model="value"
        :config="editorConfig"
      ></ckeditor>
    </div>
    <small class="p-error pt-1 pl-2" :id="id + '-text-error'">{{
      errorMessage || '&nbsp;'
    }}</small>
  </div>
</template>
<style lang="scss" scoped>
$height: 150px;
::v-deep .ck-editor__editable {
  min-height: $height;
}

.disable {
  pointer-events: none;
}

.textBox {
  border: 1px solid red;
}

::v-deep ol,
ul,
menu {
  list-style: revert !important;
  margin: 20px !important;
  padding: 0 !important;
}

::v-deep ul,
menu {
  list-style: revert !important;
  margin: 20px !important;
  padding: 0 !important;
}
</style>
