import React from "react";

function reducer(state, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "SET_FIELD_VALUE":
      return {
        ...state,
        values: {
          ...state.values,
          ...action.payload,
        },
        dirtyFields: {
          ...state.dirtyFields,
          ...getDirtyFields(action.payload, state.initialValues),
        },
      };
    default:
      return state;
  }
}

function getDirtyFields(values = {}, initialValues = {}) {
  return Object.keys(values).reduce((acc, key) => {
    acc[key] = values[key] != initialValues[key];

    return acc;
  }, {});
}

function getInitialState(initialValues = {}) {
  return {
    values: initialValues,
    initialValues,
    dirtyFields: getDirtyFields(initialValues),
    errors: {},
  };
}

function useForm(props) {
  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState(props.values)
  );

  React.useEffect(() => {
    if (props.validate) {
      const errors = props.validate(state.values);
      dispatch({ type: "SET_ERRORS", payload: errors });
    }
  }, [state.values]);

  const handleChange = (fieldName) => (event) => {
    event.preventDefault();
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { [fieldName]: event.target.value },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = props.validate(state.values);
    if (!Object.keys(errors).length) {
      props.onSubmit(state.values);
    }
  };

  const getFieldProps = (fieldName) => ({
    value: state.values[fieldName],
    onChange: handleChange(fieldName),
  });

  return { handleChange, handleSubmit, getFieldProps, errors: state.errors };
}

function LoginForm(props) {
  const form = useForm({
    initialValues: props.initialValues,
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: (values) => {
      let errors = {};
      if (!values.password) {
        errors.password = "Password is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      }
      return errors;
    },
  });

  const { handleSubmit, getFieldProps, errors = {} } = form;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <br />
        <input type="text" {...getFieldProps("email")} />
        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
      </label>
      <br />
      <label>
        Password:
        <br />
        <input type="text" {...getFieldProps("password")} />
        {errors.password && (
          <div style={{ color: "red" }}>{errors.password}</div>
        )}
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

const Exercise = () => (
  <React.Fragment>
    <p>Custom Login Form with validation</p>
    <LoginForm
      initialValues={{
        password: "",
        email: "",
      }}
    />
  </React.Fragment>
);

export default Exercise;
