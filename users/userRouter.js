const express = require("express");
const db = require("./userDb");
const dbPosts = require("../posts/postDb");

const router = express.Router();

router.get("/", (req, res) => {
  db.get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "Could not fetch users"
      });
    });
});

router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
  const newPost = {
    text: req.body.text,
    user_id: req.params.id
  };

  if (!newPost.text) {
    res.status(400).json({
      message: "Please provide some content"
    });
  } else {
    dbPosts
      .insert(newPost)
      .then(data => {
        res.status(201).json({
          message: "Post successfully created"
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "There was an error creating a post"
        });
      });
  }
});

router.post("/", validateUser, (req, res) => {
  const newUser = {
    name: req.body.name
  };

  if (!newUser.name) {
    res.status(400).json({
      message: "Please provide a name!"
    });
  } else {
    db.insert(newUser)
      .then(data => {
        res.status(201).json({
          data,
          message: "Successfully created a user"
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "There was an error creating a user or user already exists"
        });
      });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;

  db.getById(id)
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json({
          message: `There is no user with the id of ${id}`
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `An error occured while getting user with an id of ${id}`
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;

  db.getUserPosts(id)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(400).json({
          message: `There is no user with an id of ${id} `
        });
      }
    })
    .catch(error => {
      // console.log(error)
      res.status(500).json({
        message: `An error occured while getting posts of user with an id of ${id}`
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(data => {
      res.status(200).json({
        message: "This user has been deleted"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "There was an error deleting this user"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db.update(id, changes)
    .then(data => {
      res.status(200).json({
        message: "User details successfully updated"
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "There was an error updating user details"
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = Number(req.params.id);
  db.getById(id)
    .then(data => {
      console.log(data);
      if (data) {
        next();
      } else {
        res.status(400).json({
          message: "invalid user id"
        });
      }
    })
    .catch(error => {
      res.status(404).json({
        message: "Id does not exist"
      });
    });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data"
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: "missing required name field"
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing post data"
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    });
  } else {
    next();
  }
}

module.exports = router;
