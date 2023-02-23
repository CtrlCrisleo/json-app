import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

export function show_warning(message, icon, light=''){
    onFocus(light);
    const mySwal = withReactContent(Swal);
    mySwal.fire({
        title:message,
        icon:icon
    });
}

function onFocus(light){
    if(light !== ''){
        document.getElementById(light).focus();
    }
}