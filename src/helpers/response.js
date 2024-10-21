export const success = (messages, data, statusCode) => {
    return {
        messages,
        responseType: "OK",
        code: statusCode,
        data,
    };
};

export const error = (messages, statusCode) => {
    const codes = [200, 201, 400, 401, 403, 404, 408, 422, 429, 500];
    //Busco los códigos de respuesta
    const findCode = codes.find((code) => code == statusCode);
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
    return {
        messages,
        code: statusCode,
        responseType: "FAILED",
    };
};

export const validation = (errors) => {
    return {
        messages: errors,
        responseType: "FAILED",
        code: 422,
        // errors,
    };
}; 
// export const validation = (errors) => {
//     return {
//         messages: ["Validation errors"],
//         responseType: "FAILED",
//         code: 422,
//         errors,
//     };
// }; 