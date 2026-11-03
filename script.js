document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const businessCard = document.getElementById('businessCard');
  const cardContainer = document.querySelector('.card-container');
  const flipCardBtn = document.getElementById('flipCardBtn');
  const showDetailsBtn = document.getElementById('showDetailsBtn');
  const backCloseBtn = document.getElementById('backCloseBtn');
  const returnFrontBtn = document.getElementById('returnFrontBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const emailCopyBox = document.getElementById('emailCopyBox');
  const copyBtn = document.getElementById('copyBtn');
  const userEmail = document.getElementById('userEmail');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  let isFlipped = false;
  let toastTimeout = null;

  /* ==========================================================================
     1. Flip Card Feature
     ========================================================================== */
  function toggleFlip(forceState) {
    if (typeof forceState === 'boolean') {
      isFlipped = forceState;
    } else {
      isFlipped = !isFlipped;
    }

    if (isFlipped) {
      businessCard.classList.add('is-flipped');
      // 플립 시 3D 기울기 초기화
      businessCard.style.transform = 'rotateY(180deg)';
    } else {
      businessCard.classList.remove('is-flipped');
      businessCard.style.transform = 'rotateY(0deg)';
    }
  }

  flipCardBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip();
  });

  showDetailsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip(true);
  });

  backCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip(false);
  });

  returnFrontBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip(false);
  });

  /* ==========================================================================
     2. 3D Tilt Effect on Mouse Move
     ========================================================================== */
  const maxTilt = 12; // 최대 기울기 각도 (deg)

  cardContainer.addEventListener('mousemove', (e) => {
    // 뒤집힌 상태이거나 모바일 터치 시 과도한 왜곡 방지
    if (isFlipped) return;

    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within container
    const y = e.clientY - rect.top;  // y position within container

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    businessCard.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
  });

  cardContainer.addEventListener('mouseleave', () => {
    if (!isFlipped) {
      businessCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      businessCard.style.transition = 'transform 0.5s ease-out';
    }
  });

  cardContainer.addEventListener('mouseenter', () => {
    if (!isFlipped) {
      businessCard.style.transition = 'transform 0.1s ease-out';
    }
  });

  /* ==========================================================================
     3. Copy Email to Clipboard & Toast Alert
     ========================================================================== */
  function showToast(message) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastMsg.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  async function copyEmailToClipboard() {
    const email = userEmail.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for non-https or older browsers
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // 복사 아이콘 일시적 변경
      const icon = copyBtn.querySelector('i');
      icon.className = 'fa-solid fa-check';
      icon.style.color = '#10b981';

      setTimeout(() => {
        icon.className = 'fa-regular fa-copy';
        icon.style.color = '';
      }, 1800);

      showToast('이메일 주소가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      showToast('이메일 복사에 실패했습니다. 수동으로 복사해주세요.');
    }
  }

  emailCopyBox.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailToClipboard();
  });

  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyEmailToClipboard();
  });

  /* ==========================================================================
     4. Theme Toggle (Dark / Light)
     ========================================================================== */
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const themeIcon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', '라이트 모드로 변경');
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', '다크 모드로 변경');
    }
  }

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
});

