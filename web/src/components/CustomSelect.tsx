import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import './CustomSelect.css';

interface CustomSelectProps {
    options: any[];
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
    selectedValue: any;
    selectionChange: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options = [],
    placeholder = 'Select an option',
    labelKey = 'name',
    valueKey = '_id',
    selectedValue,
    selectionChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const found = options.find(o => o[valueKey] === selectedValue);
    const selectedLabel = found ? found[labelKey] : '';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (event: React.MouseEvent) => {
        if (!isOpen) {
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (rect) {
                const screenHeight = window.innerHeight;
                setDropUp((screenHeight - rect.bottom) < 220);
            }
        }
        setIsOpen(!isOpen);
    };

    const selectOption = (option: any) => {
        selectionChange(option[valueKey]);
        setIsOpen(false);
    };

    return (
        <div className={`custom-select-wrapper ${isOpen ? 'open' : ''} ${dropUp ? 'open-up' : ''}`} ref={wrapperRef}>
            <div className="select-trigger" onClick={toggle}>
                <span className={!selectedLabel ? 'placeholder' : ''}>{selectedLabel || placeholder}</span>
                <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 8l4 4 4-4" /></svg>
            </div>
            {isOpen && (
                <div className="options-list">
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <div
                                key={index}
                                className={`option-item ${option[valueKey] === selectedValue ? 'selected' : ''}`}
                                onClick={() => selectOption(option)}
                            >
                                {option[labelKey]}
                                {option[valueKey] === selectedValue && <span className="check" style={{ display: 'flex', alignItems: 'center' }}><Check size={16} /></span>}
                            </div>
                        ))
                    ) : (
                        <div className="no-options">No options available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
