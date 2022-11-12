import {
    ormCreateQuestion as _createQuestion,
    ormGetAllQuestions as _getAllQuestions,
    ormFindQuestion as _findQuestion,
    ormDeleteQuestion as _deleteQuestion,
    ormChangeDifficulty as _changeDifficulty,
} from "../model/question-orm.js";
import redisClient from "../index";

export async function getAllQuestions(req, res) {
  try {
    const _allQuestions = await redisClient.get("allQuestions");

    if (!_allQuestions) {
      console.log("Not in redis cache");
      const allQuestions = await _getAllQuestions();
      if (!allQuestions) {
        return res.status(400).json({ message: "No questions found" });
      }
      redisClient.setEx("allQuestions", 200, JSON.stringify(allQuestions));
      return res
        .status(200)
        .json({ _size: allQuestions.length, allQuestions: allQuestions });
    } else {
      console.log("Is cached");
      const allQuestions = await redisClient.get("allQuestions");
      return res.status(200).json({
        _size: JSON.parse(allQuestions).length,
        allQuestions: JSON.parse(allQuestions),
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting questions from database" });
  }
}

export async function clearCache(req, res) {
    try {
      const _allQuestions = await redisClient.get("allQuestions");
      if (!_allQuestions) {
        return res.status(200).json({ message: "Cache is empty" });
      } else {
        redisClient.flushDb();
        return res.status(200).json({ message: "Cache is flushed" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error connecting with redis" });
    }
  }

export async function findQuestion(req, res) {
    try {
      const { name } = req.query;
      if (name) {
        const question = await _findQuestion(name);
        // check if name exists
        if (!question) {
          return res.status(400).json({ message: "Question does not exist" });
        }
        return res.status(200).json({
          question: question,
          message: `Found question ${name} successfully`,
        });
      } else {
        return res.status(400).json({ message: "Incomplete fields" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error in finding the question" });
    }
  }

export async function createQuestion(req, res) {
    try {
        const { title, difficulty, question } = req.body;
        if (title, difficulty && question) {
            const resp = await _createQuestion(title, difficulty, question);
            console.log(resp);
            if(resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create question"});
            } else {
                console.log(`Created new question difficulty: ${difficulty} successfully!`);
                return res
                    .status(201)
                    .json({ message: `Created new question difficulty: ${difficulty} successfully!`});
            }
        } else {
            return res
                .status(400)
                .json({ message: "Difficulty and/or Question are missing!"});
        }
    } catch (err) {
        return res
            .status(500)
            .json({message: "Database failure when creating new question!" });
    }
}


export async function deleteQuestion(req, res) {
    try {
        const { question_id } = req.params;
        if (question_id) {
            console.log(question_id)
            const resp = await _deleteQuestion(question_id);
            console.log(resp);
            if(resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not delete question"});
            } else {
                console.log("Question deleted successfully!");
                return res
                    .status(200)
                    .json({ message: "Question deleted successfully!"});
            }
        } else {
            return res
                .status(400)
                .json({ message: "Id is missing!"})
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Database failure when deleting question!"});
    }
}

export async function changeDifficulty(req, res) {
    try {
      const { name, newDifficulty } = req.body;
      if (name && newDifficulty) {
        const question = await _findQuestion(name);
  
        // check if name exists
        if (!question) {
          return res.status(400).json({ message: "Question does not exist" });
        }
  
        const resp = await changeDifficulty(name, newDifficulty);
        if (resp.err) {
          return res
            .status(400)
            .json({ message: "Could not update difficulty!" });
        } else {
          return res.status(200).json({
            message: `Successfully updated grader for question ${name}!`,
          });
        }
      } else {
        return res.status(400).json({
          message: "Incomplete Fields!",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error when updating difficulty!" });
    }
  }