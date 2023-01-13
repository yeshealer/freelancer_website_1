import {isMobile} from "../mCommons/mUtils";

const getStyleClassForModal = (isOpen = false) => {
    const styleClasses = [];
    styleClasses.push((isOpen) ? 'showModal' : 'hideModal');
    if (!isMobile())
        styleClasses.push('desktopMode');
    else
        styleClasses.push('mobileMode');

    return styleClasses.join(' ');
};

export default getStyleClassForModal;
