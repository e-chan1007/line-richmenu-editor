import Vue from "vue";
import ENavbar from "~/components/Navbar.vue";
import ELineWindow from "~/components/LineWindow.vue";
import EFormGroup from "~/components/FormGroup.vue";
import EAlert from "~/components/Alert.vue";
import ECollapsableList from "~/components/CollapsableList.vue";
import ECollapsableListItem from "~/components/CollapsableListItem.vue";
import EAreaEditor from "~/components/AreaEditor.vue";
import EModal from "~/components/Modal.vue";
import Prism from "~/components/Prism.vue";

Vue.mixin({
  components: {
    ENavbar,
    ELineWindow,
    EFormGroup,
    EAlert,
    ECollapsableList,
    ECollapsableListItem,
    EAreaEditor,
    EModal,
    Prism
  }
});
