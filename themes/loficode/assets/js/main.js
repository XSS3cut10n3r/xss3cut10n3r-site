// LofiCode Main JavaScript

(function () {
  "use strict";

  // Theme toggle functionality with auto-detection
  const themeToggle = document.querySelector(".theme-toggle");
  const htmlElement = document.documentElement;

  // Auto-detect theme preference
  function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }

    // Use system preference if no saved theme
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  }

  // Set initial theme
  const currentTheme = getInitialTheme();
  htmlElement.setAttribute("data-theme", currentTheme);

  // Update button icon and text based on theme
  function updateThemeIcon() {
    const isDark = htmlElement.getAttribute("data-theme") === "dark";
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? "☀️" : "🌙";
    }
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem("theme")) {
          const newTheme = e.matches ? "dark" : "light";
          htmlElement.setAttribute("data-theme", newTheme);
          updateThemeIcon();
        }
      });
  }

  if (themeToggle) {
    updateThemeIcon();

    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon();
    });
  }

  // Reading progress (for blog posts)
  const readingProgress = document.querySelector(".reading-progress");
  if (readingProgress) {
    function updateReadingProgress() {
      const article = document.querySelector(".post-content");
      if (!article) return;

      const scrolled = window.scrollY;
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;

      const progress = Math.max(
        0,
        Math.min(
          100,
          ((scrolled - articleTop + windowHeight) / articleHeight) * 100
        )
      );

      readingProgress.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress(); // Initial call
  }

  // Ambient sound controls
  const muteToggle = document.querySelector(".mute-toggle");
  const ambientIcons = document.querySelectorAll(".ambient-icon");
  const ambientLabel = document.querySelector(".ambient-label");
  const volumeSlider = document.querySelector(".volume-slider");
  const equalizer = document.querySelector(".equalizer");

  let currentSound = null;
  let isPlaying = false;
  let audioElements = {};

  // Sound data
  const sounds = {
    coffee: { name: "Coffee Shop Ambience", emoji: "☕" },
    rain: { name: "Gentle Rain", emoji: "🌧️" },
    fireplace: { name: "Crackling Fireplace", emoji: "🔥" },
  };

  function updateAmbientState() {
    if (!muteToggle || !ambientLabel || !equalizer) return;

    const muteIcon = muteToggle.querySelector("i");

    if (isPlaying && currentSound) {
      muteToggle.classList.remove("muted");
      if (muteIcon) {
        muteIcon.className = "fas fa-volume-up";
      }
      muteToggle.title = "Mute ambient sounds";
      equalizer.classList.remove("muted");
      ambientLabel.textContent = `Playing: ${sounds[currentSound].name}`;
    } else {
      muteToggle.classList.add("muted");
      if (muteIcon) {
        muteIcon.className = "fas fa-volume-mute";
      }
      muteToggle.title = "Play ambient sounds";
      equalizer.classList.add("muted");
      if (currentSound) {
        ambientLabel.textContent = `Paused: ${sounds[currentSound].name}`;
      } else {
        ambientLabel.textContent = "Click to start ambient sounds";
      }
    }
  }

  // Load audio file
  async function loadSound(soundType) {
    if (audioElements[soundType]) {
      return audioElements[soundType];
    }

    try {
      const audio = new Audio(`/audio/${soundType}.mp3`);
      audio.loop = true;
      audio.volume = volumeSlider ? volumeSlider.value : 0.3;

      // Handle loading errors gracefully
      audio.addEventListener("error", () => {
        console.log(`Could not load ${soundType} audio file`);
        if (ambientLabel) {
          ambientLabel.textContent = `${sounds[soundType].name} not available`;
        }
        // Remove the audio element from cache so it doesn't try again
        delete audioElements[soundType];
      });

      // Test if the audio file exists by trying to load it
      return new Promise((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => {
          audioElements[soundType] = audio;
          resolve(audio);
        });

        audio.addEventListener("error", () => {
          reject(new Error(`Audio file not found: ${soundType}.mp3`));
        });

        // Set a timeout to avoid hanging
        setTimeout(() => {
          reject(new Error(`Audio loading timeout: ${soundType}.mp3`));
        }, 5000);

        audio.load();
      });
    } catch (error) {
      console.log(`Error loading ${soundType} audio:`, error);
      if (ambientLabel) {
        ambientLabel.textContent = `${sounds[soundType].name} not available`;
      }
      return null;
    }
  }

  if (muteToggle) {
    muteToggle.addEventListener("click", async () => {
      if (currentSound) {
        const audio = audioElements[currentSound];
        if (audio) {
          if (isPlaying) {
            audio.pause();
            isPlaying = false;
          } else {
            try {
              await audio.play();
              isPlaying = true;
            } catch (e) {
              console.log("Could not play audio:", e);
            }
          }
          updateAmbientState();
        }
      }
    });
  }

  ambientIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const soundType = icon.dataset.sound;

      // Stop current sound if playing
      if (currentSound && audioElements[currentSound]) {
        audioElements[currentSound].pause();
        isPlaying = false;
      }

      // Remove active state from all icons
      ambientIcons.forEach((i) => i.classList.remove("active"));

      if (currentSound === soundType && !isPlaying) {
        // If clicking the same sound that's paused, play it
        const audio = audioElements[soundType];
        if (audio) {
          try {
            await audio.play();
            isPlaying = true;
            icon.classList.add("active");
          } catch (e) {
            console.log("Could not play audio:", e);
          }
        }
      } else if (currentSound === soundType && isPlaying) {
        // If clicking the same sound that's playing, stop it
        currentSound = null;
        isPlaying = false;
      } else {
        // Start new sound
        currentSound = soundType;

        try {
          const audio = await loadSound(soundType);
          if (audio) {
            await audio.play();
            isPlaying = true;
            icon.classList.add("active");
          } else {
            // Audio file not available
            isPlaying = false;
            currentSound = null;
            if (ambientLabel) {
              ambientLabel.textContent = `${sounds[soundType].name} not available`;
            }
          }
        } catch (e) {
          console.log("Could not load or play audio:", e);
          isPlaying = false;
          currentSound = null;
          if (ambientLabel) {
            ambientLabel.textContent = `${sounds[soundType].name} not available`;
          }
        }
      }

      updateAmbientState();
    });
  });

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const volume = e.target.value;

      // Update volume for all loaded audio elements
      Object.values(audioElements).forEach((audio) => {
        audio.volume = volume;
      });

      // Visual feedback on equalizer intensity
      const bars = document.querySelectorAll(".equalizer-bar");
      bars.forEach((bar) => {
        bar.style.opacity = Math.max(0.3, volume);
      });
    });
  }

  // Initialize ambient state
  updateAmbientState();

  // Copy code functionality for shortcodes
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const codeContent = e.target.parentElement.nextElementSibling.textContent;

      try {
        await navigator.clipboard.writeText(codeContent);
        btn.textContent = "Copied!";
        btn.style.background = "rgba(0, 255, 0, 0.3)";

        setTimeout(() => {
          btn.textContent = "Copy";
          btn.style.background = "rgba(255, 255, 255, 0.2)";
        }, 2000);
      } catch (err) {
        btn.textContent = "Failed";
        setTimeout(() => {
          btn.textContent = "Copy";
        }, 2000);
      }
    });
  });

  // Enhanced code fence functionality for markdown
  function initializeCodeFences() {
    const highlights = document.querySelectorAll(".highlight");

    highlights.forEach((highlight) => {
      // Extract language from class names
      const pre = highlight.querySelector("pre");
      const code = highlight.querySelector("code");

      if (code) {
        // Look for language class (e.g., language-html, language-javascript)
        const classList = Array.from(code.classList);
        const langClass = classList.find((cls) => cls.startsWith("language-"));

        if (langClass) {
          const lang = langClass.replace("language-", "");
          highlight.setAttribute("data-lang", lang);
        }
      }

      // Add copy functionality to markdown code fences
      highlight.addEventListener("click", async (e) => {
        // Check if click is on the copy button area (pseudo-element)
        const rect = highlight.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Copy button is positioned at center-right of header (header is ~50px tall)
        if (clickX > rect.width - 80 && clickY < 50) {
          e.preventDefault();

          const code = highlight.querySelector("code");
          if (code) {
            try {
              // Extract clean code content without line numbers
              let codeText = code.textContent;

              // Remove line numbers if they exist
              // Hugo often generates line numbers in various formats
              codeText = codeText
                // Remove numbered lines (e.g., "1 ", "2 ", etc. at start of lines)
                .replace(/^\s*\d+\s+/gm, '')
                // Remove line number spans or elements
                .replace(/^\s*\d+\s*/gm, '')
                // Clean up any extra whitespace
                .trim();

              await navigator.clipboard.writeText(codeText);

              // Visual feedback - temporarily change the pseudo-element content
              highlight.setAttribute("data-copied", "true");

              setTimeout(() => {
                highlight.removeAttribute("data-copied");
              }, 2000);
            } catch (err) {
              console.log("Copy failed:", err);
            }
          }
        }
      });
    });
  }

  // Initialize code fences when DOM is ready
  initializeCodeFences();

  // Table of contents generation and highlighting
  function generateTOC() {
    const tocContent = document.getElementById("toc-content");
    const headings = document.querySelectorAll(".post-body h2, .post-body h3");

    if (!tocContent || headings.length === 0) return;

    const tocList = document.createElement("ul");

    headings.forEach((heading, index) => {
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const li = document.createElement("li");
      if (heading.tagName === "H3") li.className = "toc-sub";
      const a = document.createElement("a");
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = heading.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });

    tocContent.appendChild(tocList);
  }

  function updateTOC() {
    const headings = document.querySelectorAll(".post-body h2, .post-body h3");
    const tocLinks = document.querySelectorAll("#toc-content a");

    if (headings.length === 0 || tocLinks.length === 0) return;

    let current = 0;
    headings.forEach((heading, i) => {
      if (heading.getBoundingClientRect().top <= 100) {
        current = i;
      }
    });

    tocLinks.forEach((link, i) => {
      link.classList.toggle("active", i === current);
    });
  }

  // Generate TOC if we're on a blog post
  if (document.querySelector(".post-body")) {
    generateTOC();
    window.addEventListener("scroll", updateTOC);
    updateTOC(); // Initial call
  }

  // Filter the full post collection before paginating each category.
  const filterTags = document.querySelectorAll(".filter-tags .tag");
  const postsContainer = document.getElementById("posts-container");
  const loadMoreBtn = document.getElementById("load-more-btn");
  const postsPerPage = 5;
  let selectedTag = null;
  let visibleLimit = postsPerPage;

  function renderPostCategory() {
    if (!postsContainer) return;
    let matchingCount = 0;
    postsContainer.querySelectorAll(".post-item").forEach((post) => {
      const tags = JSON.parse(post.dataset.tags || "[]");
      const matches = !selectedTag || tags.includes(selectedTag);
      post.hidden = !matches || matchingCount >= visibleLimit;
      post.style.display = "";
      post.style.outline = "";
      if (matches) matchingCount++;
    });
    if (loadMoreBtn) {
      loadMoreBtn.style.display = matchingCount > visibleLimit ? "flex" : "none";
      loadMoreBtn.dataset.loaded = Math.min(visibleLimit, matchingCount);
      loadMoreBtn.dataset.total = matchingCount;
    }
  }

  if (postsContainer) {
    filterTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        filterTags.forEach((item) => item.classList.toggle("active", item === tag));
        selectedTag = tag.dataset.tag || null;
        visibleLimit = postsPerPage;
        renderPostCategory();
      });
    });
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        visibleLimit += postsPerPage;
        renderPostCategory();
      });
    }
    renderPostCategory();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Sliding Search Form functionality
  const searchToggle = document.querySelector(".search-toggle");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchClose = document.querySelector(".search-close");
  const searchSubmit = document.querySelector(".search-submit");

  let searchData = [];
  let isSearchOpen = false;

  // Load search data (posts) - works on all pages
  async function loadSearchData() {
    // If we're on the homepage, use the existing post items
    const posts = document.querySelectorAll(".post-item");
    if (posts.length > 0) {
      searchData = Array.from(posts).map((post) => {
        const titleElement = post.querySelector(".post-title-vaporwave a");
        const excerptElement = post.querySelector(".post-excerpt-vaporwave");
        const tagsElements = post.querySelectorAll(".post-tag-vaporwave");
        const dateElement = post.querySelector(".post-date");

        return {
          title: titleElement ? titleElement.textContent : "",
          url: titleElement ? titleElement.href : "",
          excerpt: excerptElement ? excerptElement.textContent : "",
          tags: Array.from(tagsElements).map((tag) => tag.textContent),
          date: dateElement ? dateElement.textContent : "",
          element: post,
        };
      });
    } else {
      // If we're on other pages, try to fetch the homepage to get post data
      try {
        const response = await fetch("/");
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const homepagePosts = doc.querySelectorAll(".post-item");

        searchData = Array.from(homepagePosts).map((post) => {
          const titleElement = post.querySelector(".post-title-vaporwave a");
          const excerptElement = post.querySelector(".post-excerpt-vaporwave");
          const tagsElements = post.querySelectorAll(".post-tag-vaporwave");
          const dateElement = post.querySelector(".post-date");

          return {
            title: titleElement ? titleElement.textContent : "",
            url: titleElement ? titleElement.href : "",
            excerpt: excerptElement ? excerptElement.textContent : "",
            tags: Array.from(tagsElements).map((tag) => tag.textContent),
            date: dateElement ? dateElement.textContent : "",
            element: null, // No element reference since we're not on homepage
          };
        });
      } catch (error) {
        console.log("Could not load search data:", error);
        searchData = [];
      }
    }
  }

  // Toggle search form
  function toggleSearch() {
    isSearchOpen = !isSearchOpen;

    if (isSearchOpen) {
      searchForm.classList.add("active");
      setTimeout(() => {
        searchInput.focus();
      }, 300);
    } else {
      searchForm.classList.remove("active");
      searchInput.value = "";
      searchResults.innerHTML = "";
      searchResults.classList.remove("has-results");
      // Reset post visibility
      resetPostVisibility();
    }
  }

  // Reset post visibility and filters
  function resetPostVisibility() {
    const posts = document.querySelectorAll(".post-item");
    posts.forEach((post) => {
      post.style.display = "grid";
      post.style.outline = "none";
    });

    // Reset filter tags
    const filterTags = document.querySelectorAll(".filter-tags .tag");
    filterTags.forEach((tag) => tag.classList.remove("active"));
    const allTag =
      document.querySelector('.filter-tags .tag[data-tag="all"]') ||
      document.querySelector(".filter-tags .tag:first-child");
    if (allTag) allTag.classList.add("active");
  }

  // Perform search
  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("has-results");
      resetPostVisibility();
      return;
    }

    const searchLower = query.toLowerCase();
    const results = searchData.filter((post) => {
      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });

    displaySearchResults(results, query);
    highlightSearchResults(results);
  }

  // Display search results
  function displaySearchResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-no-results">
          No posts found for "${query}". Try different keywords or browse by tags.
        </div>
      `;
    } else {
      const resultsHTML = results
        .map(
          (post) => `
        <div class="search-result-item" onclick="handleSearchResultClick('${
          post.url
        }')">
          <div class="search-result-title">${highlightText(
            post.title,
            query
          )}</div>
          <div class="search-result-excerpt">${highlightText(
            truncateText(post.excerpt, 120),
            query
          )}</div>
          <div class="search-result-meta">
            <span>${post.date}</span>
            <span>${post.tags.join(", ")}</span>
          </div>
        </div>
      `
        )
        .join("");

      searchResults.innerHTML = resultsHTML;
    }

    searchResults.classList.add("has-results");
  }

  // Handle search result clicks with SPA navigation
  function handleSearchResultClick(url) {
    // Close search first
    toggleSearch();

    // Use SPA navigation if available
    if (window.spa && url.startsWith("/posts/")) {
      const slug = url.split("/posts/")[1].replace("/", "");
      window.spa.showPost(slug, true);
    } else {
      // Fallback to regular navigation
      window.location.href = url;
    }
  }

  // Make handleSearchResultClick globally accessible
  window.handleSearchResultClick = handleSearchResultClick;

  // Highlight search results on page (only works on homepage)
  function highlightSearchResults(results) {
    const posts = document.querySelectorAll(".post-item");

    // Only highlight if we're on a page with post items (homepage)
    if (posts.length > 0) {
      const resultUrls = new Set(results.map((r) => r.url));

      posts.forEach((post) => {
        const titleLink = post.querySelector(".post-title-vaporwave a");
        if (titleLink && resultUrls.has(titleLink.href)) {
          post.style.display = "grid";
          post.style.outline = "2px solid var(--accent-primary)";
        } else {
          post.style.display = "none";
        }
      });
    }
  }

  // Highlight text matches
  function highlightText(text, query) {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return text.replace(
      regex,
      '<mark style="background: var(--accent-primary); color: white; padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>'
    );
  }

  // Escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Truncate text
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + "...";
  }

  // Event listeners for search
  if (searchToggle) {
    loadSearchData();

    searchToggle.addEventListener("click", toggleSearch);
  }

  if (searchClose) {
    searchClose.addEventListener("click", toggleSearch);
  }

  if (searchInput) {
    // Real-time search as user types
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300); // Debounce search
    });

    // Handle Enter key
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(searchInput.value);
      }

      // Close search with Escape
      if (e.key === "Escape") {
        toggleSearch();
      }
    });
  }

  if (searchSubmit) {
    searchSubmit.addEventListener("click", () => {
      performSearch(searchInput.value);
    });
  }

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isSearchOpen &&
      !searchForm.contains(e.target) &&
      !searchToggle.contains(e.target)
    ) {
      toggleSearch();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Theme toggle with 't' key
    if (e.key === "t" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName !== "INPUT" &&
        activeElement.tagName !== "TEXTAREA"
      ) {
        if (themeToggle) {
          themeToggle.click();
        }
      }
    }

    // Mute toggle with 'm' key
    if (e.key === "m" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const activeElement = document.activeElement;
      if (
        activeElement.tagName !== "INPUT" &&
        activeElement.tagName !== "TEXTAREA"
      ) {
        if (muteToggle) {
          muteToggle.click();
        }
      }
    }
  });

  // Add loading states for ambient sounds
  function showLoadingState(soundType) {
    const icon = document.querySelector(`[data-sound="${soundType}"]`);
    if (icon) {
      icon.style.opacity = "0.5";
      icon.style.transform = "scale(0.9)";
    }
  }

  function hideLoadingState(soundType) {
    const icon = document.querySelector(`[data-sound="${soundType}"]`);
    if (icon) {
      icon.style.opacity = "";
      icon.style.transform = "";
    }
  }

  // Enhanced audio loading with loading states
  async function loadSoundWithLoading(soundType) {
    if (audioElements[soundType]) {
      return audioElements[soundType];
    }

    showLoadingState(soundType);

    const audio = new Audio(`/audio/${soundType}.mp3`);
    audio.loop = true;
    audio.volume = volumeSlider ? volumeSlider.value : 0.3;

    // Handle loading events
    audio.addEventListener("canplaythrough", () => {
      hideLoadingState(soundType);
    });

    audio.addEventListener("error", () => {
      hideLoadingState(soundType);
      console.log(`Could not load ${soundType} audio file`);
      if (ambientLabel) {
        ambientLabel.textContent = `${sounds[soundType].name} not available`;
      }
    });

    audioElements[soundType] = audio;
    return audio;
  }

  // Fade in/out effects for audio
  function fadeIn(audio, duration = 1000) {
    audio.volume = 0;
    const targetVolume = volumeSlider ? volumeSlider.value : 0.3;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  function fadeOut(audio, duration = 500) {
    const initialVolume = audio.volume;
    const steps = 10;
    const stepTime = duration / steps;
    const volumeStep = initialVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(initialVolume - volumeStep * currentStep, 0);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
      }
    }, stepTime);
  }

  // Posts use native navigation so links work independently of the JSON feed.

  // Console easter egg
  console.log(`
    ☕ Welcome to LofiCode! ☕

    You found the console! Here are some keyboard shortcuts:

    't' - Toggle theme (light/dark)
    'm' - Mute/unmute ambient sounds

    Built with love, coffee, and way too many interruptions.
    Happy coding! ✨
    `);
})();

