
import {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    findQuestion,
    changeDifficulty,

} from "./repository.js";

export async function ormCreateQuestion(title, difficulty, question) {
    try {
        const newQuestion = await createQuestion({title, difficulty, question });
        newQuestion.save();
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new question");
        return { err };
    }
}

export async function ormDeleteQuestion(id) {
    try {
        await deleteQuestion({id});
        return true;
    } catch (err) {
        console.log("ERROR: could not delete question");
        return { err };
    }
}

export async function ormGetAllQuestions() {
    try {
        const question = await getAllQuestions();
        return { question };
    } catch (err) {
        console.log("ERROR: could no retrieve question");
        return { err }
    }
}

export async function ormChangeDifficulty(name, newDifficulty) {
    try {
      const questionUpdated = await changeDifficulty(name, newDifficulty);
      return questionUpdated;
    } catch (err) {
      console.log("ERROR: Could not update grader");
      return { err };
    }
  }
  

export async function ormFindQuestion(name) {
    try {
      const question = await findQuestion(name);
      return question;
    } catch (err) {
      console.log("ERROR: Database error");
      return { err };
    }
  }