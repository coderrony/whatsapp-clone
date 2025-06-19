import axios from "axios";

// const cloud_name = process.env.REACT_APP_CLOUD_NAME2;
// const cloud_secret = process.env.REACT_APP_CLOUD_SECRET2;


import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_PRESET } from "../config/env.config";

export const uploadFiles = async (files) => {
  let formData = new FormData();
  formData.append("upload_preset", CLOUDINARY_CLOUD_PRESET);
  let uploaded = [];
  for (const f of files) {
    const { file, type } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    console.log("res ",res);
    
    uploaded.push({
      file: res,
      type: type,
    });
  }
  return uploaded;
};

const uploadToCloudinary = (formData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        formData
      )
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};