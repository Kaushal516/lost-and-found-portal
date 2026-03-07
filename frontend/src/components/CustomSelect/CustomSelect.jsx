import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ options, value, onChange, placeholder = "Select...", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } }); // Mock event object to match native select
        setIsOpen(false);
    };

    return (
        <div className={`${styles.selectContainer} ${className}`} ref={dropdownRef}>
            <div
                className={`${styles.selectBox} ${isOpen ? styles.selectBoxActive : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                tabIndex={0}
            >
                <span className={selectedOption ? styles.selectedValue : styles.placeholder}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} className={`${styles.arrow} ${isOpen ? styles.arrowRotate : ''}`} />
            </div>

            {isOpen && (
                <ul className={styles.dropdownList + " glass"}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`${styles.dropdownItem} ${value === option.value ? styles.itemActive : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
