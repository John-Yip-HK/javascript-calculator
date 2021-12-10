const ghpages = require('gh-pages');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
 
readline.question('What is the branch and commit message (please separate them with a comma (,))?\n', branchAndMsg => {
  const [branch, msg] = branchAndMsg.split(",");
  ghpages.publish('build', {
    branch: branch,
    message: msg
  }, () => {
    console.log(`\nSuccessfully pushed into remote ${branch} branch!\nCommit message: ${msg}`);
    readline.close();
  });
});