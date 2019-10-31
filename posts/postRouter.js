const express = "express";

const router = express.Router();

router.get("/", (req, res) => {
    
});

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.params.id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res
          .status(404)
          .json({ message: "Post id does not correspond with an actual hub" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message:
          "Something terrible happend while checking post id: " + error.message
      });
    });
}

module.exports = router;
