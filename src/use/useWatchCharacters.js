import {watch} from "vue";

export function useWatchCharacters(valueToWatch, maxChars = 100) {
    watch(valueToWatch, (newValue, oldValue) => {
        if (newValue.length === maxChars) {
            alert(`Only ${maxChars} characters allowed`)
        }
    });
}
