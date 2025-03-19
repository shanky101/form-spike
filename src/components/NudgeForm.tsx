import React, { useState, useEffect } from "react";
import {
  useLoaderData,
  useSubmit,
  Form,
  useActionData,
  useNavigate,
  redirect,
} from "react-router-dom";
import {
  Container,
  Title,
  Select,
  TextInput,
  Textarea,
  Grid,
  Radio,
  Group,
  Button,
  Box,
  Chip,
  Paper,
  Text,
  Alert,
  Stack,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { IconInfoCircle, IconCalendar, IconClock } from "@tabler/icons-react";
import { NudgeFormData, ApiResponse } from "../types";
import * as api from "../api/nudgeApi";
import { Node } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { useClickOutside } from '@mantine/hooks';

// Define styles as a simple object for Mantine v7
// In Mantine v7, we use regular objects for styles
const getStyles = () => {
  return {
    formContainer: {
      padding: '20px',
      maxWidth: "1200px",
      margin: "0 auto",
    },
    formSection: {
      marginBottom: '20px',
    },
    sectionTitle: {
      marginBottom: '16px',
      fontWeight: 600,
    },
    mandatoryField: {
      position: "relative" as const,
    },
    fieldInfo: {
      display: "flex",
      alignItems: "center",
      marginBottom: '8px',
    },
    characterCount: {
      textAlign: "right" as const,
      fontSize: '12px',
      color: '#868e96',
    },
    actionButtons: {
      display: "flex",
      gap: '16px',
      justifyContent: "center",
      marginTop: '20px',
    },
    chipContainer: {
      display: "flex",
      gap: '8px',
      marginTop: '8px',
    },
    variableDropdown: {
      position: "relative" as const,
      display: 'inline-block'
    },
    variableList: {
      position: "absolute" as const,
      top: "100%",
      left: 0,
      width: "200px",
      backgroundColor: '#fff',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      zIndex: 100,
      marginTop: '4px'
    },
    variableItem: {
      padding: '8px',
      cursor: "pointer",
      "&:hover": {
        backgroundColor: '#f8f9fa',
      },
    },
    variableToken: {
      cursor: 'pointer',
      display: 'inline-block',
      color: '#228BE6',
      backgroundColor: '#E7F5FF',
      padding: '2px 4px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      userSelect: 'all'
    },
  };
};

// Create a simpler custom extension
const CustomVariable = Extension.create({
  name: 'customVariable',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          isVariable: {
            default: false,
            parseHTML: element => element.getAttribute('data-variable') === 'true',
            renderHTML: attributes => {
              if (!attributes.isVariable) return {};
              return {
                'data-variable': 'true',
                'class': 'variable-token'
              };
            }
          }
        }
      }
    ];
  }
});

export const loader = async ({ params }: { params: any }) => {
  const [
    businessUnits,
    verticals,
    nudgeRules,
    frequencies,
    priorities,
    dateRangePresets,
  ] = await Promise.all([
    api.fetchBusinessUnits(),
    api.fetchVerticals(),
    api.fetchNudgeRules(),
    api.fetchFrequencies(),
    api.fetchPriorities(),
    api.fetchDateRangePresets(),
  ]);

  let nudgeData: NudgeFormData = {
    businessUnit: "",
    vertical: "",
    nudgeName: "",
    nudgeRule: "",
    description: "",
    startDate: null,
    endDate: null,
    timeOfDay: "",
    frequency: "",
    priority: "",
    coolOffPeriod: "",
    status: "Draft",
    dateRangeSelector: "",
    targetStartDate: null,
    targetEndDate: null,
    channels: [],
    channelContent: "",
  };

  if (params.id) {
    const response = await api.fetchNudgeData(params.id);
    if (response.success) {
      nudgeData = response.data;
    }
  }

  return {
    businessUnits: businessUnits.data,
    verticals: verticals.data,
    nudgeRules: nudgeRules.data,
    frequencies: frequencies.data,
    priorities: priorities.data,
    dateRangePresets: dateRangePresets.data,
    nudgeData,
  };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData.entries());

  const nudgeData: NudgeFormData = {
    businessUnit: rawData.businessUnit as string,
    vertical: rawData.vertical as string,
    nudgeName: rawData.nudgeName as string,
    nudgeRule: rawData.nudgeRule as string,
    description: rawData.description as string,
    startDate: rawData.startDate ? new Date(rawData.startDate as string) : null,
    endDate: rawData.endDate ? new Date(rawData.endDate as string) : null,
    timeOfDay: rawData.timeOfDay as string,
    frequency: rawData.frequency as string,
    priority: rawData.priority as string,
    coolOffPeriod: rawData.coolOffPeriod as string,
    status: rawData.status as "Draft" | "Active" | "Inactive",
    dateRangeSelector: rawData.dateRangeSelector as string,
    targetStartDate: rawData.targetStartDate
      ? new Date(rawData.targetStartDate as string)
      : null,
    targetEndDate: rawData.targetEndDate
      ? new Date(rawData.targetEndDate as string)
      : null,
    channels: (rawData.channels as string).split(","),
    channelContent: rawData.channelContent as string,
  };

  const response = await api.submitNudgeData(nudgeData);

  if (response.success) {
    return redirect(`/nudge/${response.data.id}`);
  }

  return {
    success: false,
    message: response.message || "Failed to submit nudge data",
  };
};

const NudgeForm: React.FC = () => {
  const {
    businessUnits,
    verticals,
    nudgeRules,
    frequencies,
    priorities,
    dateRangePresets,
    nudgeData,
  } = useLoaderData() as any;

  const actionData = useActionData() as ApiResponse<any> | undefined;
  const submit = useSubmit();
  const navigate = useNavigate();
  const styles = getStyles();

  const [formValues, setFormValues] = useState<NudgeFormData>(nudgeData);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [showVariables, setShowVariables] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Variables for text editor
  const variables = [
    "Candidate_Name",
    "User_Name",
    "Variable 3",
    "Variable 4",
    "Variable 5",
    "Variable 6",
  ];

  // Rich text editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      CustomVariable
    ],
    content: formValues.channelContent || '',
    onUpdate: ({ editor }) => {
      handleInputChange('channelContent', editor.getHTML());
    }
  });

  // Simplified insertVariable function
  const insertVariable = (variable: string) => {
    if (editor) {
      const variableText = `{{${variable}}}`;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: variableText,
          marks: [
            {
              type: 'textStyle',
              attrs: { isVariable: true }
            }
          ]
        })
        .run();
      setShowVariables(false);
    }
  };

  // Update form values
  const handleInputChange = (field: keyof NudgeFormData, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (field === "description") {
      setDescriptionLength(value.length);
    }
  };

  // Toggle channel selection
  const handleChannelToggle = (channel: string) => {
    setFormValues((prev) => {
      const channels = prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else if (value !== null) {
        formData.append(key, String(value));
      }
    });

    submit(formData, { method: "post" });
  };

  // Handle form reset
  const handleReset = () => {
    setFormValues(nudgeData);
    if (editor) {
      editor.commands.setContent(nudgeData.channelContent);
    }
  };

  // Validate form on change
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

  // Add ref for click outside handling
  const dropdownRef = useClickOutside(() => {
    setShowVariables(false);
  });

  return (
    <Container size="xl" style={styles.formContainer}>
      <Paper p="lg" shadow="xs" withBorder>
        <Box mb="xl">
          <Title order={3}>NUDGE DETAILS (ID: 123456)</Title>
          <Text size="sm" color="gray">
            Creator ID: Nirmala Dubey (198765)
          </Text>
        </Box>

        <Form onSubmit={handleSubmit}>
          {actionData && !actionData.success && (
            <Alert color="red" mb="md">
              {actionData.message}
            </Alert>
          )}

          <Box style={styles.formSection}>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Business Unit"
                  placeholder="Pick a Business Unit"
                  data={businessUnits}
                  value={formValues.businessUnit}
                  onChange={(value) =>
                    handleInputChange("businessUnit", value || "")
                  }
                  required
                  style={styles.mandatoryField}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Vertical"
                  placeholder="All"
                  data={verticals}
                  value={formValues.vertical}
                  onChange={(value) =>
                    handleInputChange("vertical", value || "")
                  }
                />
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col>
                <TextInput
                  label="Name of the Nudge"
                  placeholder="Type here"
                  value={formValues.nudgeName}
                  onChange={(e) =>
                    handleInputChange("nudgeName", e.target.value)
                  }
                  required
                  style={styles.mandatoryField}
                />
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col>
                <Select
                  label="Nudge Rule selection"
                  placeholder="Select a rule from dropdown"
                  data={nudgeRules}
                  value={formValues.nudgeRule}
                  onChange={(value) =>
                    handleInputChange("nudgeRule", value || "")
                  }
                  required
                  style={styles.mandatoryField}
                />
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col>
                <Box>
                  <Text component="label" size="sm" fw={500}>
                    Description
                  </Text>
                  <Textarea
                    placeholder="Placeholder"
                    value={formValues.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    maxLength={800}
                    minRows={4}
                  />
                  <Text style={styles.characterCount}>
                    {descriptionLength}/800 characters
                  </Text>
                </Box>
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Select Date"
                  value={formValues.startDate}
                  onChange={(date) => handleInputChange("startDate", date)}
                  required
                  leftSection={<IconCalendar size={16} />}
                  style={styles.mandatoryField}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="End Date"
                  placeholder="Select Date"
                  value={formValues.endDate}
                  onChange={(date) => handleInputChange("endDate", date)}
                  required
                  leftSection={<IconCalendar size={16} />}
                  style={styles.mandatoryField}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TimeInput
                  label="Time of day"
                  placeholder="Pick a time to send nudge"
                  value={formValues.timeOfDay}
                  onChange={(e) =>
                    handleInputChange("timeOfDay", e.target.value)
                  }
                  leftSection={<IconClock size={16} />}
                />
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col span={6}>
                <Select
                  label="Frequency"
                  placeholder="Select"
                  data={frequencies}
                  value={formValues.frequency}
                  onChange={(value) =>
                    handleInputChange("frequency", value || "")
                  }
                  disabled={!formValues.startDate || !formValues.endDate}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Cool-off Period"
                  placeholder="Type No. of Days"
                  value={formValues.coolOffPeriod}
                  onChange={(e) =>
                    handleInputChange("coolOffPeriod", e.target.value)
                  }
                  type="number"
                />
              </Grid.Col>
            </Grid>

            <Grid mt="md">
              <Grid.Col span={6}>
                <Select
                  label="Priority"
                  placeholder="Select"
                  data={priorities}
                  value={formValues.priority}
                  onChange={(value) =>
                    handleInputChange("priority", value || "")
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Box>
                  <Text
                    component="label"
                    size="sm"
                    fw={500}
                    style={styles.mandatoryField}
                  >
                    Status
                  </Text>
                  <Radio.Group
                    value={formValues.status}
                    onChange={(value) =>
                      handleInputChange(
                        "status",
                        value as NudgeFormData["status"]
                      )
                    }
                    color="purple"
                  >
                    <Group mt="xs">
                      <Radio value="Draft" label="Draft" color="purple" />
                      <Radio value="Active" label="Active" color="purple" />
                      <Radio value="Inactive" label="Inactive" color="purple" />
                    </Group>
                  </Radio.Group>
                </Box>
              </Grid.Col>
            </Grid>
          </Box>

          <Box style={styles.formSection}>
            <Title order={4} style={styles.sectionTitle}>
              TARGET PROFILES
            </Title>
            <Box style={styles.fieldInfo}>
              <IconInfoCircle size={16} style={{ marginRight: 8 }} />
              <Text size="sm">Select Profiles by Creation Date</Text>
            </Box>

            <Grid>
              <Grid.Col span={4}>
                <Select
                  label="Date Range Selector"
                  placeholder="Pick a preset date range"
                  data={dateRangePresets}
                  value={formValues.dateRangeSelector}
                  onChange={(value) =>
                    handleInputChange("dateRangeSelector", value || "")
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Select Date"
                  value={formValues.targetStartDate}
                  onChange={(date) =>
                    handleInputChange("targetStartDate", date)
                  }
                  required
                  leftSection={<IconCalendar size={16} />}
                  style={styles.mandatoryField}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <DatePickerInput
                  label="End Date"
                  placeholder="Select Date"
                  value={formValues.targetEndDate}
                  onChange={(date) => handleInputChange("targetEndDate", date)}
                  required
                  leftSection={<IconCalendar size={16} />}
                  style={styles.mandatoryField}
                />
              </Grid.Col>
            </Grid>
          </Box>

          <Box style={styles.formSection}>
            <Title order={4} style={styles.sectionTitle}>
              CHANNEL SELECTION
            </Title>
            <Text size="sm" mb="xs" style={styles.mandatoryField}>
              Select the channels to send the nudge
            </Text>
            <Box style={styles.chipContainer}>
              <Chip
                checked={formValues.channels.includes("Email")}
                onChange={() => handleChannelToggle("Email")}
                color="purple"
              >
                Email
              </Chip>
              <Chip
                checked={formValues.channels.includes("Whatsapp")}
                onChange={() => handleChannelToggle("Whatsapp")}
                color="purple"
              >
                Whatsapp
              </Chip>
            </Box>
          </Box>

          <Box style={styles.formSection}>
            <Title order={4} style={styles.sectionTitle}>
              CHANNEL CONTENT
            </Title>
            <Box mb="md" style={{ position: "relative" }}>
              {editor && (
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                    </RichTextEditor.ControlsGroup>
                    
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>
                    
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>
                    
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                    
                    <RichTextEditor.ControlsGroup>
                      <Box 
                        style={styles.variableDropdown}
                        ref={dropdownRef}
                      >
                        <Button
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowVariables(!showVariables);
                          }}
                          variant="outline"
                          style={{ borderColor: '#7a52db', color: '#7a52db' }}
                        >
                          Insert Variables
                        </Button>
                        
                        {showVariables && (
                          <Paper style={styles.variableList} shadow="md">
                            <Stack gap="xs" p="xs">
                              {variables.map((variable) => (
                                <Button
                                  key={variable}
                                  variant="subtle"
                                  size="sm"
                                  fullWidth
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    insertVariable(variable);
                                  }}
                                  style={{ color: '#7a52db' }}
                                >
                                  {variable}
                                </Button>
                              ))}
                            </Stack>
                          </Paper>
                        )}
                      </Box>
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>
                  <RichTextEditor.Content />
                </RichTextEditor>
              )}
            </Box>
            <Text style={styles.characterCount}>4000/4000 remaining</Text>
          </Box>

          <Box style={styles.actionButtons}>
            <Button
              variant="default"
              size="md"
              onClick={handleReset}
              style={{ width: 200, borderColor: '#e0e0e0' }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="md"
              disabled={!isFormValid}
              style={{ width: 200, backgroundColor: '#7a52db' }}
            >
              Submit
            </Button>
          </Box>
        </Form>
      </Paper>
    </Container>
  );
};

export default NudgeForm;
