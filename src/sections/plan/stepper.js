import { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Card, Stack, Button } from '@mui/material';
import PropTypes from 'prop-types';
import PlanNewEditForm from './plan-new-edit-form';
import KeyOutcomes from './key-outcomes';
import ProgramModule from './program-module';


const steps = ['Plan Details', 'Key Outcomes', 'Program Modules'];



export default function PlanStepper({currentPlan} ) {
  const [activeStep, setActiveStep] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(()=>{
    if(currentPlan){
      setCurrentCourseId(currentPlan?.courses?.id);
    }
  }, [currentPlan])

  // Render the form for the current step
  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return <PlanNewEditForm currentPlan={currentPlan || null} setCourseId={setCourseId} setActiveStep={setActiveStep} setCurrentCourseId={setCurrentCourseId}  />;
      case 1:
        return <KeyOutcomes courseId={courseId} activeStep={activeStep} setActiveStep={setActiveStep} currentCourseId={currentCourseId} currentOutcomes={currentPlan?.courses?.keyOutComes}/>;
      case 2:
        return <ProgramModule courseId={courseId}  activeStep={activeStep} setActiveStep={setActiveStep} currentCourseId={currentCourseId} currentModules={currentPlan?.courses?.programModules}/>;
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
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack spacing={3}>{renderForm()}</Stack>
    </Card>
  );
}

PlanStepper.propTypes ={
  currentPlan: PropTypes.object,
}
