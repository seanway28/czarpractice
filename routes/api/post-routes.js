const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');

// Get All Posts

outer.get('/', (req, res) => {
    console.log('=======================');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        order: [[ 'created_at', 'DESC']],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
    }).then(dpPostData => res.json(dpPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    });

 //Get a single post
 router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id.' });
            return;
          }
          res.json(dbPostData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
  }); 

  // Create a Post
  router.post('/', (req, res) => {
      // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
      Post.create({
          title: req.body.title,
          post_url: req.body.post_url,
          user_id: req.body.user_id
      })
        .then(dbPostData => res).json(dbPostData)
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
  });

  // API/Posts/Upvotes
  router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });

    // Updaate Post
    outer.put('/:id'), (req, res) => {
        Post.updatedPostData(
            {
                title: req.body.title
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id.'});
                return;
            }
            res.json(dbPostData);
        }).catch(err => {
             console.log(err);
             res.status(500).json(err);
        });
        };

        // Delete a Post
        router.delete('/:id', (req, res) => {
            Post.destroy({
              where: {
                id: req.params.id
              }
            })
              .then(dbPostData => {
                if (!dbPostData) {
                  res.status(404).json({ message: 'No post found with this id' });
                  return;
                }
                res.json(dbPostData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
        });
        module.exports = router;