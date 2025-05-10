const { Octokit } = require('@octokit/core');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

exports.handler = async (event) => {
  const { name, refreshToken } = JSON.parse(event.body);
  //fetch existing config.json
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/config.json', {
    owner: 'YOUR_GH_USER', repo: 'spotify-multiuser-widget'
  });
  const content = Buffer.from(data.content, 'base64').toString();
  const users = JSON.parse(content);

  //append new user
  users.push({ name, refreshToken });
  const newContent = Buffer.from(JSON.stringify(users, null, 2)).toString('base64');

  //commit back
  await octokit.request('PUT /repos/{owner}/{repo}/contents/config.json', {
    owner: 'YOUR_GH_USER', repo: 'spotify-multiuser-widget', path: 'config.json',
    message: `Add ${name}`, content: newContent, sha: data.sha
  });

  return { statusCode: 200, body: 'User registered' };
};