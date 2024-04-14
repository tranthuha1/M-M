/* eslint-disable import/no-extraneous-dependencies */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Toast from 'vue-toastification';
import ConfirmationService from 'primevue/confirmationservice';
import Password from 'primevue/password';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ElementPlus from 'element-plus';
import VueApexCharts from 'vue3-apexcharts';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import ButtonPrimary from '@/components/base/ButtonPrimary.vue';
import LoadingOverlay from '@/components/base/LoadingOverlay.vue';
import VInputText from '@/components/base/VInputText.vue';
import VRadioButton from '@/components/base/VRadioButton.vue';
import VTextarea from '@/components/base/VTextarea.vue';
import VDropDown from '@/components/base/VDropDown.vue';
import VCheckbox from '@/components/base/VCheckBox.vue';
import VCalendar from '@/components/base/VCalendar.vue';
import VMultiSelect from '@/components/base/VMultiSelect.vue';
import router from './router';
import '@/css/index.css';
import App from './App.vue';

const app = createApp(App);

const pinia = createPinia();
library.add(fas);
library.add(fab);
library.add(far);
dom.watch();
app.use(CKEditor);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Password', Password);
app.component('Tag', Tag);
app.component('ButtonPrimary', ButtonPrimary);
app.component('VInputText', VInputText);
app.component('VRadioButton', VRadioButton);
app.component('VTextarea', VTextarea);
app.component('VDropDown', VDropDown);
app.component('VButton', Button);
app.component('VCheckbox', VCheckbox);
app.component('VCalendar', VCalendar);
app.component('VMultiSelect', VMultiSelect);
app.component('RadioButton', RadioButton);

app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(Toast);
app.use(ElementPlus);
app.use(VueApexCharts);
app.component('LoadingOverlay', LoadingOverlay);
app.mount('#app');
