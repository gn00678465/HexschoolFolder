(function() {
  const http = require('node:http');
  const mongoose = require('mongoose');
  const { IncomingMessage, ServerResponse } = require('http');
  const Post = require('./model/post');
  const handleError = require('./utils/error');
  require('dotenv').config();

  interface Post {
    name: string;
    content: string;
  }
  
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('資料庫連接成功'));

  const requestListener = async (req: typeof IncomingMessage, res: typeof ServerResponse) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
      'Content-Type': 'application/json'
    }
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    if (req.url === '/posts' && req.method === 'GET') {
      const posts = await Post.find();
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        data: posts || []
      }));
      res.end();
    } else if (req.url === '/posts' && req.method === 'POST') {
      req.on('end', async() => {
        try {
          const data = JSON.parse(body);
          if (!data?.name || !data?.content) {
            handleError(res, headers, 400, '欄位未填寫正確，或無此 todo ID');
            res.end();
          } else {
            const newPost = await Post.create({
              name: data.name,
              content: data.content
            });
            res.writeHead(200, headers);
            res.write(JSON.stringify({
              status: 'success',
              data: newPost
            }))
            res.end();
          }
        }
        catch(e) {
          handleError(res, headers, 400, e);
          res.end();
        }
      })
    } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
      const id = req.url.split('/').pop();
      await Post.findByIdAndDelete(id);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        data: null
      }))
      res.end();
    } else if (req.method === 'OPTIONS') {
      res.writeHead(200, headers);
      res.end();
    } else {
      handleError(res, headers, 404, '無此網站路由');
      res.end();
    }
  };

  const server = http.createServer(requestListener);
  server.listen(3000);
})()