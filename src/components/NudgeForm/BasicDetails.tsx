import { Grid, Select, TextInput, Textarea, Box, Text } from '@mantine/core';
import { NudgeFormData } from '../../types';

interface BasicDetailsProps {
  formValues: NudgeFormData;
  businessUnits: any[];
  verticals: any[];
  nudgeRules: any[];
  descriptionLength: number;
  handleInputChange: (field: keyof NudgeFormData, value: any) => void;
  styles: Record<string, any>;
}

export const BasicDetails = ({
  formValues,
  businessUnits,
  verticals,
  nudgeRules,
  descriptionLength,
  handleInputChange,
  styles,
}: BasicDetailsProps) => {
  return (
    <Box style={styles.formSection}>
      <Grid>
        <Grid.Col span={6}>
          <Select
            label="Business Unit"
            placeholder="Pick a Business Unit"
            data={businessUnits}
            value={formValues.businessUnit}
            onChange={(value) => handleInputChange("businessUnit", value || "")}
            required
            style={styles.mandatoryField}
          />
        </Grid.Col>
        {/* ... Rest of the basic details section ... */}
      </Grid>
    </Box>
  );
}; 