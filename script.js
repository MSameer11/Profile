document.addEventListener('DOMContentLoaded', function() {
    const profilePic = document.getElementById('profile-pic');
    const profilePicInput = document.getElementById('profile-pic-input');
    const editProfileBtn = document.getElementById('edit-profile');
    const saveProfileBtn = document.getElementById('save-profile');
    const addPlatformBtn = document.getElementById('add-platform');
    const savedDetailsList = document.getElementById('saved-details-list');

    const modal = document.getElementById('modal');
    const detailsModal = document.getElementById('details-modal');
    const closeModal = document.querySelector('.close');
    const detailsCloseModal = document.querySelector('.details-close');
    const platformType = document.getElementById('platform-type');
    const platformDropdown = document.getElementById('platform-list');
    const addPlatformToListBtn = document.getElementById('add-platform-btn');
    const saveDetailsBtn = document.getElementById('save-details-btn');
    const platformDetailsForm = document.getElementById('platform-details-form');
    const copyDetailsBtn = document.getElementById('copy-details-btn'); // Added for copy button

    // Define the platforms directly in the code
    const platforms = {
        social: [
            { name: 'Gmail', icon: 'gmail.png', fields: [{ id: 'gmail-address', label: 'Gmail Address', type: 'email' }] },
            { name: 'WhatsApp', icon: 'whatsapp.png', fields: [{ id: 'whatsapp-number', label: 'WhatsApp Number', type: 'tel' }] },
            // Add more social platforms with corresponding fields
        ],
        payment: [
            { name: 'Bank 1', icon: 'bank1.png', fields: [{ id: 'bank1-account', label: 'Bank Account Number', type: 'text' }] },
            { name: 'Wallet 1', icon: 'wallet1.png', fields: [{ id: 'wallet1-id', label: 'Wallet ID', type: 'text' }] },
            // Add more payment methods with corresponding fields
        ]
    };

    profilePic.addEventListener('click', () => profilePicInput.click());
    profilePicInput.addEventListener('change', handleProfilePicChange);
    editProfileBtn.addEventListener('click', enableEditProfile);
    saveProfileBtn.addEventListener('click', saveProfile);
    addPlatformBtn.addEventListener('click', () => {
        modal.style.display = "block";
        updateDropdown();
    });

    closeModal.addEventListener('click', () => modal.style.display = "none");
    detailsCloseModal.addEventListener('click', () => detailsModal.style.display = "none");
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == detailsModal) {
            detailsModal.style.display = "none";
        }
    });

    platformType.addEventListener('change', updateDropdown);
    addPlatformToListBtn.addEventListener('click', showDetailsModal);
    saveDetailsBtn.addEventListener('click', savePlatformDetails);

    // Function to handle profile picture change
    function handleProfilePicChange(event) {
        const reader = new FileReader();
        reader.onload = function() {
            profilePic.src = reader.result;
            localStorage.setItem('profilePic', reader.result);
        }
        reader.readAsDataURL(event.target.files[0]);
    }

    // Function to enable profile editing
    function enableEditProfile() {
        document.getElementById('user-name').contentEditable = true;
        document.getElementById('user-email').contentEditable = true;
    }

    // Function to save profile details
    function saveProfile() {
        document.getElementById('user-name').contentEditable = false;
        document.getElementById('user-email').contentEditable = false;
        localStorage.setItem('userName', document.getElementById('user-name').innerText);
        localStorage.setItem('userEmail', document.getElementById('user-email').innerText);
    }

    // Function to update dropdown options based on platform type
    function updateDropdown() {
        const selectedType = platformType.value;
        const options = platforms[selectedType];
        platformDropdown.innerHTML = '';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.name;
            opt.textContent = option.name;
            opt.dataset.icon = option.icon;
            opt.dataset.fields = JSON.stringify(option.fields);
            platformDropdown.appendChild(opt);
        });
    }

    // Function to show details modal
    function showDetailsModal() {
        const selectedOption = platformDropdown.options[platformDropdown.selectedIndex];
        const fields = JSON.parse(selectedOption.dataset.fields);
        platformDetailsForm.innerHTML = '';
        fields.forEach(field => {
            const label = document.createElement('label');
            label.for = field.id;
            label.textContent = field.label;
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.name = field.id;
            input.required = true;
            platformDetailsForm.appendChild(label);
            platformDetailsForm.appendChild(input);
        });
        modal.style.display = "none";
        detailsModal.style.display = "block";
    }

    // Function to save platform details
    function savePlatformDetails() {
        const selectedOption = platformDropdown.options[platformDropdown.selectedIndex];
        const platformName = selectedOption.value;
        const platformIcon = selectedOption.dataset.icon;
        const fields = JSON.parse(selectedOption.dataset.fields);
        const platformData = {
            name: platformName,
            icon: platformIcon,
            details: {}
        };
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            platformData.details[field.id] = input.value;
        });
        displaySavedDetails(platformData);
        savePlatforms();
        detailsModal.style.display = "none";
    }

    // Function to display saved details with copy and delete options
    function displaySavedDetails(platformData) {
        const detailsItem = document.createElement('li');
        detailsItem.innerHTML = `
            <strong>${platformData.name}</strong><br>
            ${Object.entries(platformData.details).map(([key, value]) => `<span>${key.replace(/-/g, ' ')}: ${value}</span>`).join('<br>')}
            <button class="delete-button"><i class="fas fa-trash-alt"></i></button> <!-- Font Awesome delete icon -->
        `;
        savedDetailsList.appendChild(detailsItem);
        detailsItem.querySelector('.delete-button').addEventListener('click', () => {
            detailsItem.remove();
            savePlatforms(); // Update the local storage after deleting
        });

        // Show copy button when details are added
        copyDetailsBtn.style.display = "block";
    }

    // Function to save platform and details to local storage
    function savePlatforms() {
        const savedDetails = [];
        document.querySelectorAll('#saved-details-list li').forEach(item => {
            const name = item.querySelector('strong').innerText;
            const details = {};
            item.querySelectorAll('span').forEach(span => {
                const [key, value] = span.innerText.split(': ');
                details[key.replace(/ /g, '-')] = value;
            });
            savedDetails.push({ name, details });
        });
        localStorage.setItem('savedDetails', JSON.stringify(savedDetails));
    }

    // Function to load profile and saved details from local storage
    function loadProfile() {
        if (localStorage.getItem('profilePic')) {
            profilePic.src = localStorage.getItem('profilePic');
        }
        if (localStorage.getItem('userName')) {
            document.getElementById('user-name').innerText = localStorage.getItem('userName');
        }
        if (localStorage.getItem('userEmail')) {
            document.getElementById('user-email').innerText = localStorage.getItem('userEmail');
        }
        if (localStorage.getItem('savedDetails')) {
            const savedDetails = JSON.parse(localStorage.getItem('savedDetails'));
            savedDetails.forEach(platformData => {
                displaySavedDetails(platformData);
            });
        }
    }

    // Function to copy details to clipboard
    function copyPlatformDetails() {
        const details = Array.from(savedDetailsList.querySelectorAll('li')).map(li => {
            const name = li.querySelector('strong').innerText;
            const detailText = Array.from(li.querySelectorAll('span')).map(span => span.innerText).join('\n');
            return `${name}\n${detailText}`;
        }).join('\n\n');

        navigator.clipboard.writeText(details).then(() => {
            alert('Details copied to clipboard!');
        }, err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Attach event listener to the copy button
    copyDetailsBtn.addEventListener('click', copyPlatformDetails);

    // Load profile and saved details when page is loaded
    loadProfile();
});
