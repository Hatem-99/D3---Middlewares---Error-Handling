import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const bookSchema = {
    title: {
      in: ["body"],
      isString: {
        errorMessage: "Title is a mandatory field and needs to be a string",
      },
    },
    category: {
      in: ["body"],
      isString: {
        errorMessage: "Category is a mandatory field and needs to be a string",
      },
    },
    cover: {
        in: ["body"],
        isString: {
            errorMessage: "Cover is a mandatory field and needs to be a url as string "
        }
    }
 
  }
  

  
  export const checkBooksSchema = checkSchema(bookSchema) 
  
  export const checkValidationResult = (req, res, next) => {
   
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      
      next(
        createHttpError(400, "Validation errors in request body", {
          errorsList: errors.array(),
        })
      )
    } else {
   
      next()
    }
  }