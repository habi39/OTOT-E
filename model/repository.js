import QuestionModel from "./question-model.js";
//Set up mongoose connection
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({path:'./../.env'})

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"))

export async function createQuestion(params) {
    console.log(params);
    let title = params.title
    let difficulty = params.difficulty;
    let question = params.question;
    let index = 0;
    let questionCount = await QuestionModel.countDocuments({difficulty: difficulty});
    console.log(questionCount);
    if(questionCount == 0) {
        index = 1;
    } else {
        index = await QuestionModel
            .find({difficulty: difficulty})
            .sort({index:-1}).limit(1);
        index = index[0].index + 1;
    }
    return new QuestionModel({index:index, title: title, difficulty: difficulty, question: question});
}

export async function getAllQuestions() {
    let question = await QuestionModel.find()
    return question;
}

export async function deleteQuestion(params) {
    let id = params.id;
    await QuestionModel.findOneAndDelete({ _id: id});
}

export async function findQuestion(name) {
    return QuestionModel.findOne({ name });
  }

  export async function changeDifficulty(name, newDifficulty) {
    return QuestionModel.updateOne(
      {
        name: name,
      },
      {
        $set: {
          difficulty: newDifficulty,
        },
      }
    );
  }