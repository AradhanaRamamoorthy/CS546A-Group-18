const moodForm = document.getElementById('moodForm');

if(moodForm)
{
    const moodLabels = document.getElementsByClassName("mood-label");
    const moodInputs = document.getElementsByName("usermood");
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.getElementsByClassName('text-goes-here')[0];
    errorContainer.classList.add('hidden');
    for(const labels of moodLabels) {
        labels.addEventListener("click", () => {
        const mood_clicked = document.getElementById(labels.getAttribute("for"));
        if(mood_clicked)
        {
            for (const label_selected of moodLabels) {
                label_selected.classList.remove("selected");
            }
            labels.classList.add("selected");
        }   
      });
    }
    moodForm.addEventListener("submit", (event) => {
        let selectedMood = null;
        for (let i = 0; i < moodInputs.length; i++) 
        {
            if (moodInputs[i].checked) {
                selectedMood = moodInputs[i];
                break;
            }
        }
        if (!selectedMood) 
        {
            event.preventDefault();
            errorMessage.textContent = "Please select a mood before submitting.";
            errorContainer.classList.remove('hidden'); 
        }  
    });
}