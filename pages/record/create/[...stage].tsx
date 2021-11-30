import { Field, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/dist/client/router";

type FormData = {
  firstName: string;
  lastName: string;
};

const formSteps = [
  {
    Fields: () => {
      const { errors, values } = useFormikContext<FormData>();

      return (
        <>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="Jane" />
          {errors.firstName && <div>{errors.firstName}</div>}

          {values.firstName === "Chris" ? <div>Hello, world!</div> : null}
        </>
      );
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.firstName) {
        errors.firstName = "Required";
      }

      return errors;
    },
    hasNextStep: true,
  },
  {
    Fields: () => {
      const { errors } = useFormikContext<FormData>();

      return (
        <>
          {errors.lastName && <div>{errors.lastName}</div>}
          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Smith" />
        </>
      );
    },
    validate: (values) => {
      const errors: any = {};

      if (!values.lastName) {
        errors.lastName = "Required";
      }

      return errors;
    },
    hasNextStep: false,
  },
];

const getFormStep = (stageType: string, stageNumber: string | null) => {
  if (stageType === "step") {
    return formSteps[parseInt(stageNumber) - 1] || null;
  }

  return null;
};

const CreateForm = () => {
  const { query, push } = useRouter();

  const [stageType, stageNumber] = Array.isArray(query.stage)
    ? query.stage
    : [query.stage];

  const formStep = getFormStep(stageType, stageNumber);

  if (!formStep) {
    return null;
  }

  const { Fields, validate, hasNextStep } = formStep;

  const handleSubmit = (values: any) => {
    if (hasNextStep) {
      push(`step/${parseInt(stageNumber) + 1}`);
      return;
    }

    console.log({ values });
  };

  return (
    <Formik<FormData>
      initialValues={{
        firstName: "",
        lastName: "",
      }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      <Form>
        <Fields />

        <p>
          <button type="submit">{hasNextStep ? "Next" : "Submit"}</button>
        </p>
      </Form>
    </Formik>
  );
};

export default CreateForm;
