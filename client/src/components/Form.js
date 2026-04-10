import React, { useState } from "react";
import axios from "axios";

function Form() {
  //STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    resStreet1: "",
    resStreet2: "",
    sameAddress: false,
    permStreet1: "",
    permStreet2: "",
  });

  const [errors, setErrors] = useState({});

 const [documents, setDocuments] = useState([
  {
    fileName: "",
    fileType: "",
    file: null,
  },
  {
    fileName: "",
    fileType: "",
    file: null,
  },
]);

  //HANDLERS

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSameAddress = (e) => {
    const checked = e.target.checked;

    setFormData({
      ...formData,
      sameAddress: checked,
      permStreet1: checked ? formData.resStreet1 : "",
      permStreet2: checked ? formData.resStreet2 : "",
    });
  };

  const handleDocumentChange = (index, e) => {
    const { name, value, files } = e.target;

    const updatedDocs = [...documents];

    updatedDocs[index][name] = name === "file" ? files[0] : value;

    setDocuments(updatedDocs);
  };

  const addDocument = () => {
    setDocuments([
      ...documents,
      {
        fileName: "",
        fileType: "",
        file: null,
      },
    ]);
  };

  //VALIDATION FUNCTIONS

  const isAdult = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const validateForm = () => {
    let newErrors = {};

    if (documents.length < 2) {
      newErrors.documents = "Minimum two documents required";
    }

    documents.forEach((doc, index) => {
      if (!doc.fileName) {
        newErrors[`docName${index}`] = "File name required";
      }

      if (!doc.fileType) {
        newErrors[`docType${index}`] = "File type required";
      }

      if (!doc.file) {
        newErrors[`docFile${index}`] = "File required";
      }
    });
    if (!formData.firstName) newErrors.firstName = "First name is required";

    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.email) newErrors.email = "Email is required";

    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else if (!isAdult(formData.dob))
      newErrors.dob = "You must be at least 18 years old";

    if (!formData.resStreet1)
      newErrors.resStreet1 = "Residential Street 1 required";

    if (!formData.sameAddress && !formData.permStreet1)
      newErrors.permStreet1 = "Permanent address required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT HANDLER
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    const formDataToSend = new FormData();

    // Personal details
    formDataToSend.append(
      "firstName",
      formData.firstName
    );

    formDataToSend.append(
      "lastName",
      formData.lastName
    );

    formDataToSend.append(
      "email",
      formData.email
    );

    formDataToSend.append(
      "dob",
      formData.dob
    );

    // Addresses
    formDataToSend.append(
      "resStreet1",
      formData.resStreet1
    );

    formDataToSend.append(
      "resStreet2",
      formData.resStreet2
    );

    formDataToSend.append(
      "permStreet1",
      formData.permStreet1
    );

    formDataToSend.append(
      "permStreet2",
      formData.permStreet2
    );

    // Documents
    documents.forEach((doc) => {
      formDataToSend.append(
        "fileName",
        doc.fileName
      );

      formDataToSend.append(
        "fileType",
        doc.fileType
      );

      formDataToSend.append(
        "documents",
        doc.file
      );
    });

    const response =
      await axios.post(
        "https://verbose-disco-4j9rx77wxv6cj49g-5000.app.github.dev/api/users",
        formDataToSend,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    alert(response.data.message);

  } catch (error) {
    console.error(error);

    alert("Error submitting form");
  }
};

  //RETURN
  return (
    <div>
      <h2>MERN STACK MACHINE TEST</h2>

      <form onSubmit={handleSubmit}>
        <h3>Personal Details</h3>

        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        {errors.dob && <p style={{ color: "red" }}>{errors.dob}</p>}

        <h3>Residential Address</h3>

        <input
          type="text"
          name="resStreet1"
          value={formData.resStreet1}
          onChange={handleChange}
          placeholder="Street 1"
        />
        {errors.resStreet1 && (
          <p style={{ color: "red" }}>{errors.resStreet1}</p>
        )}
        <input
          type="text"
          name="resStreet2"
          value={formData.resStreet2}
          onChange={handleChange}
          placeholder="Street 2"
        />
        {errors.resStreet2 && (
          <p style={{ color: "red" }}>{errors.resStreet2}</p>
        )}
        <h3>Permanent Address</h3>

        <label>
          <input
            type="checkbox"
            name="sameAddress"
            checked={formData.sameAddress}
            onChange={handleSameAddress}
          />
          Same as Residential Address
        </label>

        <input
          type="text"
          name="permStreet1"
          value={formData.permStreet1}
          onChange={handleChange}
          placeholder="Street 1"
        />
        {errors.permStreet1 && (
          <p style={{ color: "red" }}>{errors.permStreet1}</p>
        )}

        <input
          type="text"
          name="permStreet2"
          value={formData.permStreet2}
          onChange={handleChange}
          placeholder="Street 2"
        />

        <h3>Upload Documents</h3>

        {documents.map((doc, index) => (
          <div key={index}>
            <input
              type="text"
              name="fileName"
              placeholder="File Name"
              value={doc.fileName}
              onChange={(e) => handleDocumentChange(index, e)}
            />

            {errors[`docName${index}`] && (
              <p style={{ color: "red" }}>{errors[`docName${index}`]}</p>
            )}

            <select
              name="fileType"
              value={doc.fileType}
              onChange={(e) => handleDocumentChange(index, e)}
            >
              <option value="">Select Type</option>

              <option value="image">Image</option>

              <option value="pdf">PDF</option>
            </select>

            {errors[`docType${index}`] && (
              <p style={{ color: "red" }}>{errors[`docType${index}`]}</p>
            )}

            <input
              type="file"
              name="file"
              onChange={(e) => handleDocumentChange(index, e)}
            />

            {errors[`docFile${index}`] && (
              <p style={{ color: "red" }}>{errors[`docFile${index}`]}</p>
            )}
          </div>
        ))}

        <button type="button" onClick={addDocument}>
          Add Document
        </button>

        {errors.documents && <p style={{ color: "red" }}>{errors.documents}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;
