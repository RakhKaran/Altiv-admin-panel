import { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Card, Stack, Button } from '@mui/material';
import PropTypes from 'prop-types';
import PlanNewEditForm from './plan-new-edit-form';
import KeyOutcomes from './key-outcomes';
import ProgramModule from './program-module';
import Tools from './tools';
import Faq from './faq';


const steps = ['Plan Details', 'Key Outcomes', 'Program Modules', 'Tools', 'FAQ'];



export default function PlanStepper({ currentPlan }) {
  const [activeStep, setActiveStep] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [planGroup, setPlanGroup] = useState(currentPlan?.planGroup || 0); 

  useEffect(() => {
    if (currentPlan) {
      setCourseId(currentPlan?.courses?.id);
      setPlanGroup(currentPlan?.planGroup || 0);
    }
  }, [currentPlan]);

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <PlanNewEditForm
            currentPlan={currentPlan || null}
            setCourseId={setCourseId}
            setActiveStep={setActiveStep}
            setPlanGroup={setPlanGroup} 
          />
        );
      case 1:
        return (
          <KeyOutcomes
            courseId={courseId}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            currentOutcomes={currentPlan?.courses?.keyOutComes}
          />
        );
      case 2:
        return (
          <ProgramModule
            courseId={courseId}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            currentModules={currentPlan?.courses?.programModules}
          />
        );
      case 3:
        return (
          <Tools
            courseId={courseId}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            currentTools={currentPlan?.courses?.tools}
          />
        );
      case 4:
        return (
          <Faq
            courseId={courseId}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            currentplansFaqs={currentPlan?.courses?.plansFaqs}
          />
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <h3>All steps completed successfully!</h3>
          </Box>
        );
    }
  };

  return (
    <Card sx={{ p: 3, boxShadow: 'none' }}>
    
      {Number(planGroup) === 0 && (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <Stack spacing={3}>{renderForm()}</Stack>
    </Card>
  );
}

PlanStepper.propTypes ={
  currentPlan: PropTypes.object,
  planGroup: PropTypes.number,
}
