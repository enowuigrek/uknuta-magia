import { useState, useCallback } from 'react';
import { validateOrderForm, sanitizeFormData, createFieldValidator } from '../utils/validation.js';

export const useFormValidation = (initialData = {}) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Aktualizacja pojedynczego pola
    const updateField = useCallback((name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Wyczyść błąd dla tego pola
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    }, [errors]);

    // Oznacz pole jako "dotknięte"
    const touchField = useCallback((name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    }, []);

    // Walidacja pojedynczego pola
    const validateField = useCallback((name, value) => {
        const validator = createFieldValidator(name);
        const error = validator ? validator(value) : null;

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return !error;
    }, []);

    // Walidacja całego formularza
    const validateForm = useCallback(() => {
        const sanitizedData = sanitizeFormData(formData);
        const validation = validateOrderForm(sanitizedData);

        setErrors(validation.errors);
        return validation.isValid;
    }, [formData]);

    // Resetowanie formularza
    const resetForm = useCallback(() => {
        setFormData(initialData);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialData]);

    // Obsługa zmiany wartości pola
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        updateField(name, fieldValue);
    }, [updateField]);

    // Obsługa blur (opuszczenie pola)
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        touchField(name);

        // Waliduj pole tylko jeśli było już dotknięte
        if (touched[name] || value) {
            validateField(name, value);
        }
    }, [touchField, validateField, touched]);

    // Obsługa submit
    const handleSubmit = useCallback(async (onSubmit) => {
        setIsSubmitting(true);

        // Oznacz wszystkie pola jako dotknięte
        const allFields = Object.keys(formData);
        const newTouched = {};
        allFields.forEach(field => {
            newTouched[field] = true;
        });
        setTouched(newTouched);

        // Waliduj formularz
        if (!validateForm()) {
            setIsSubmitting(false);
            return false;
        }

        try {
            const sanitizedData = sanitizeFormData(formData);
            await onSubmit(sanitizedData);
            return true;
        } catch (error) {
            console.error('Błąd podczas submit:', error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm]);

    // Sprawdź czy pole ma błąd i jest dotknięte
    const getFieldError = useCallback((name) => {
        return touched[name] && errors[name] ? errors[name] : null;
    }, [touched, errors]);

    // Sprawdź czy formularz jest prawidłowy
    const isFormValid = Object.keys(errors).every(key => !errors[key]) &&
        Object.keys(formData).length > 0;

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        isFormValid,
        updateField,
        handleChange,
        handleBlur,
        handleSubmit,
        validateField,
        validateForm,
        getFieldError,
        resetForm,
        setIsSubmitting
    };
};

// Hook dla prostszych formularzy (np. login)
export const useSimpleForm = (initialData = {}, validator = null) => {
    const [data, setData] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setData(prev => ({
            ...prev,
            [name]: fieldValue
        }));

        // Wyczyść błąd dla tego pola
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    }, [errors]);

    const handleSubmit = useCallback(async (onSubmit) => {
        setIsSubmitting(true);
        setErrors({});

        try {
            // Walidacja jeśli validator został przekazany
            if (validator) {
                const validation = validator(data);
                if (!validation.isValid) {
                    setErrors(validation.errors);
                    setIsSubmitting(false);
                    return false;
                }
            }

            await onSubmit(data);
            return true;
        } catch (error) {
            console.error('Błąd podczas submit:', error);
            setErrors({ general: 'Wystąpił nieoczekiwany błąd' });
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [data, validator]);

    const reset = useCallback(() => {
        setData(initialData);
        setErrors({});
        setIsSubmitting(false);
    }, [initialData]);

    return {
        data,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
        setErrors
    };
};