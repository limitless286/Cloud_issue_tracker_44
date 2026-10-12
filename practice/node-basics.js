const issue = {
  id: 101,
  title: 'Unable to access Wi-Fi',
  priority: 'High',
  status: 'Open'
};

const priorities = ['Low', 'Medium', 'High'];

function describeIssue(item) {
  return `${item.id}: ${item.title} [${item.priority}] - ${item.status}`;
}

console.log(describeIssue(issue));
console.log('Available priorities:', priorities);

const jsonText = JSON.stringify(issue, null, 2);
console.log('JSON representation:');
console.log(jsonText);

const objectAgain = JSON.parse(jsonText);
console.log('Title after parsing:', objectAgain.title);