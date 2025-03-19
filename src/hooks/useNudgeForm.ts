import { useState, useEffect } from 'react';
import { NudgeFormData } from '../types';

export const useNudgeForm = (initialData: NudgeFormData) => {
  const [formValues, setFormValues] = useState<NudgeFormData>(initialData);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (field: keyof NudgeFormData, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (field === "description") {
      setDescriptionLength(value.length);
    }
  };

  const handleReset = () => {
    setFormValues(initialData);
  };

  // Form validation
  useEffect(() => {
    const requiredFields: (keyof NudgeFormData)[] = [
      "businessUnit",
      "nudgeName",
      "nudgeRule",
      "startDate",
      "endDate",
      "status",
      "targetStartDate",
      "targetEndDate",
    ];

    const isValid = requiredFields.every((field) => {
      if (field === "channels") {
        return formValues.channels.length > 0;
      }
      return formValues[field] !== "" && formValues[field] !== null;
    });

    setIsFormValid(isValid);
  }, [formValues]);

  return {
    formValues,
    descriptionLength,
    isFormValid,
    handleInputChange,
    handleReset,
  };
}; 