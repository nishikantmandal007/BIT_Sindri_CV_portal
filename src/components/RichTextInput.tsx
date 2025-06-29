
import React, { useRef, useEffect, useState } from 'react';

interface RichTextInputProps {
    value: string;
    onChange: (newValue: string) => void;
}

const RichTextInput: React.FC<RichTextInputProps> = ({ value: parentValue, onChange }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const isFocused = useRef(false);

    // This component now manages its own state while being edited to avoid re-rendering the whole app on every keystroke.
    // The parent state is only updated onBlur.
    const [localHtml, setLocalHtml] = useState(parentValue);

    // Sync from parent state, but only when the component is not focused.
    // This prevents wiping user's unsaved changes during unrelated re-renders.
    useEffect(() => {
        if (!isFocused.current && parentValue !== localHtml) {
            setLocalHtml(parentValue);
        }
    }, [parentValue]);
    
    // If local state changes, update the DOM.
    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== localHtml) {
           contentRef.current.innerHTML = localHtml;
        }
    }, [localHtml]);


    const handleInput = () => {
        if (contentRef.current) {
            setLocalHtml(contentRef.current.innerHTML);
        }
    };

    const handleFocus = () => {
        isFocused.current = true;
    };

    const handleBlur = () => {
        isFocused.current = false;
        if (contentRef.current && contentRef.current.innerHTML !== parentValue) {
            onChange(contentRef.current.innerHTML);
        }
    };
    
    const execCmd = (command: string) => {
        // execCommand is a legacy API, but simple for this use case.
        // It directly manipulates the DOM.
        document.execCommand(command, false);
        // After command, we must re-sync our local state from the DOM.
        if (contentRef.current) {
            setLocalHtml(contentRef.current.innerHTML);
            contentRef.current.focus(); // Keep focus after button click
        }
    };

    return (
        <div className="rich-text-input w-full">
            <div className="rich-text-toolbar">
                <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => execCmd('bold')}><b>B</b></button>
                <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => execCmd('italic')}><i>I</i></button>
                <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => execCmd('underline')}><u>U</u></button>
            </div>
            <div
                ref={contentRef}
                className="rich-text-content"
                contentEditable
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                suppressContentEditableWarning
            />
        </div>
    );
};

export default RichTextInput;
