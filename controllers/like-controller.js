const { prisma } = require('../prisma/prisma-client');

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;

    if (!postId) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ error: 'Пост не найден' });
      }

      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });

      if (existingLike) {
        return res
          .status(400)
          .json({ error: 'Вы уже поставили лайк этому посту' });
      }

      const like = await prisma.like.create({
        data: { postId, userId },
      });

      res.json(like);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  unlikePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId: id, userId },
      });

      if (!existingLike) {
        return res
          .status(400)
          .json({ error: 'Вы не ставили лайк этому посту' });
      }

      const like = await prisma.like.deleteMany({
        where: { postId: id, userId },
      });

      res.json(like);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },
};

module.exports = LikeController;
