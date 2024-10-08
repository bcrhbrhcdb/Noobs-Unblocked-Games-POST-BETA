const SUPABASE_URL = 'https://jzhsqrtnbnfpfuslzadd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aHNxcnRuYm5mcGZ1c2x6YWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4OTc4OTgsImV4cCI6MjA0MzQ3Mzg5OH0.o5MthkAklPpmcv-FrWPa7I8RXp4CoCf5u1Nss-de5_M';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let currentPoll = null;
let chart = null;
const ADMIN_EMAIL = 'apet2804@mpsedu.org'; // Replace with your email

// Authentication functions
async function login() {
    const { user, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    });
    if (error) console.error('Error logging in:', error);
    else {
        currentUser = user;
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        loadPolls();
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else {
        currentUser = null;
        document.getElementById('loginButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('pollContent').innerHTML = '';
    }
}

// Poll functions
async function createPoll(question, options, deadline) {
    if (!currentUser) {
        alert('Please login to create a poll');
        return;
    }
    
    // Check if the user is an admin
    if (currentUser.email !== ADMIN_EMAIL) {
        alert('You do not have permission to create a poll.');
        return;
    }

    const { data, error } = await supabase
        .from('polls')
        .insert([{
            question: question,
            options: options,
            votes: Object.fromEntries(options.map(opt => [opt, 0])),
            created_by: currentUser.id,
            deadline: deadline
        }]);
    if (error) console.error('Error creating poll:', error);
    else {
        console.log('Poll created:', data);
        loadPolls();
    }
}

async function getPolls() {
    const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) console.error('Error fetching polls:', error);
    else return data;
}

async function getPoll(id) {
    const { data, error } = await supabase
        .from('polls')
        .select()
        .eq('id', id)
        .single();
    if (error) console.error('Error fetching poll:', error);
    else return data;
}

async function vote(pollId, optionIndex) {
    if (!currentUser) {
        alert('Please login to vote');
        return;
    }
    if (!currentPoll) return;

    const option = currentPoll.options[optionIndex];
    const votes = { ...currentPoll.votes, [option]: (currentPoll.votes[option] || 0) + 1 };

    const { data, error } = await supabase
        .from('polls')
        .update({ votes: votes })
        .eq('id', pollId);

    if (error) console.error('Error voting:', error);
    else {
        console.log('Vote recorded:', data);
        currentPoll.votes = votes;
        displayResults();
        updateAnalytics();
    }
}

// UI functions
function displayPoll(poll) {
    currentPoll = poll;
    const questionEl = document.getElementById('pollQuestion');
    const optionsEl = document.getElementById('pollOptions');

    questionEl.textContent = poll.question;
    optionsEl.innerHTML = '';

    poll.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'allButton';
        button.onclick = () => vote(poll.id, index);
        optionsEl.appendChild(button);
    });

    if (poll.deadline) {
        const deadlineEl = document.createElement('p');
        deadlineEl.textContent = `Deadline: ${new Date(poll.deadline).toLocaleString()}`;
        questionEl.appendChild(deadlineEl);
    }

    document.getElementById('resultsChart').style.display = 'none';
    document.getElementById('analyticsContainer').style.display = 'none';
}

function displayResults() {
    const optionsEl = document.getElementById('pollOptions');
    const chartEl = document.getElementById('resultsChart');
    
    optionsEl.style.display = 'none';
    chartEl.style.display = 'block';

    const labels = currentPoll.options;
    const data = labels.map(label => currentPoll.votes[label] || 0);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(chartEl, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Votes',
                data: data,
                backgroundColor: 'rgba(23, 107, 170, 0.7)',
                borderColor: 'rgb(23, 107, 170)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateAnalytics() {
    const analyticsEl = document.getElementById('analyticsContainer');
    analyticsEl.style.display = 'block';

    const totalVotes = Object.values(currentPoll.votes).reduce((a, b) => a + b, 0);
    document.getElementById('totalVotes').textContent = `Total votes: ${totalVotes}`;

    const mostPopularOptionEntry = Object.entries(currentPoll.votes).reduce((a, b) => a[1] > b[1] ? a : b);
    
      // Handle case where no votes have been cast yet.
      if (!mostPopularOptionEntry || totalVotes === 0){
          document.getElementById("mostPopularOption").textContent="No votes yet.";
          return; 
      }
    
      document.getElementById("mostPopularOption").textContent=`Most popular option: ${mostPopularOptionEntry[0]} (${mostPopularOptionEntry[1]} votes)`; 
}

async function loadPolls() {
     // Get all polls from Supabase and display them.
     const polls=await getPolls(); 
     const pollContentEl=document.getElementById("pollContent"); 
     pollContentEl.innerHTML="<h3>Available Polls</h3>"; 
     polls.forEach(poll=>{ 
         const button=document.createElement("button"); 
         button.textContent=poll.question; 
         button.className="allButton"; 
         button.onclick=()=>displayPoll(poll); 
         pollContentEl.appendChild(button); 
     }); 
}

// Event listeners and initialization
document.getElementById("loginButton").addEventListener("click", login); 
document.getElementById("logoutButton").addEventListener("click", logout); 
document.getElementById("createPollButton").addEventListener("click", () => { 
     const question=document.getElementById("newPollQuestion").value; 
     const options=document.getElementById("newPollOptions").value.split(",").map(opt=>opt.trim()); 
     const deadline=document.getElementById("newPollDeadline").value; 
     createPoll(question, options, deadline); 
});

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", () => { loadPolls(); });