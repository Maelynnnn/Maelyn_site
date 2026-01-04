document.getElementById("year").textContent = new Date().getFullYear();

const PROJECTS = {
  "no-one-is-a-lonely-planet": {
    title: "No One Is a Lonely Planet",
    facts: {
      Time: "2025",
      Type: "Interactive Public Web Narrative Art",
      Medium: ["Public Website", "Environmental Experience"],
      Tools: ["JavaScript","Three.js", "Firebase"],
      Link: "https://nooneisalonglyplanet.web.app/"
    },
    desc: [
      `No One Is a Lonely Planet is a narrative digital artwork that aims to visualize the hidden process of 
      social formation — to see who is connected, and how connection accumulates and transforms over time.
       Participants place themselves as star cubes, forming a living map where people can read the individual’s 
       profile and the galaxy’s growth — its pauses and surges, its bridges that reorganize the field — and sense 
       how a network of relationships gradually becomes a society.`
    ],
    gallery: ["../assets/nilp/1.png", "../assets/nilp/2.png", "../assets/nilp/3.png", "../assets/nilp/4.png", "../assets/nilp/5.png"]
  },

  "now-the-city-speaks": {
    title: "Now The City Speaks",
    facts: {
      Time: "2025",
      Type: "AI-driven Interactive Narrative",
      Medium: ["SDR Signals", "AI Generative Poetry", "Public Website"],
      Tools: ["RTL-SDR","Open AI API"],
      Link: "https://nowthecityspeaks.web.app/"
    },
    desc: [
      `Now The City Speaks is an AI-driven interactive narrative system that transforms the city’s radio frequencies 
      — which fluctuate with nearby human activities and architectures — into generative prose poems, 
      inviting people to read how human behaviors, infrastructures, and technologies shape the city’s voice in real time. 
      The work interprets the city not as neutral land, but as a living narrative that is shaped by countless, interwoven signals of human activity.`
    ],
    gallery: ["../assets/ntcs/1.png", "../assets/ntcs/2.png", "../assets/ntcs/3.png", "../assets/ntcs/4.png", "../assets/ntcs/5.png"]
  },

  "just-the-two-of-us": {
    title: "Just The Two Of Us",
    facts: {
      Time: "2025",
      Type: "Kinetic Sculpture",
      Medium: ["Wood", "Arduino","Large-Scale Sculpture","Environmental Experience"],
      Tools: ["Arduino","Physical Installation"],
      PlayThrough:"https://youtu.be/Rt_DIAC3GCQ"
    },
    desc: [
      `Just The Two Of Us is a 2 × 3 meter kinetic installation consisting of 45 vertically actuated modules suspended overhead. 
      The machine operates according to its own internal logic, alternating between movement and rest, independent of human control. 
      By placing humans and the machine in a shared space of quiet coexistence rather than control, the work examines whether a different relationship 
      can emerge when humans and machines meet on equal terms.`
    ],
    gallery: ["../assets/j2/1.png", "../assets/j2/2.png", "../assets/j2/3.png", "../assets/j2/4.png"]
  },

  "xiaomei": {
    title: "小梅 Mei",
    facts: {
      Time: "2025",
      Type: "Interactive Narrative Installation",
      Medium: ["Physical Computing","Interactive Installation","Storytelling"],
      Tools: ["Arduino","Physical Installation","Videos", "Environmental Experience"],
      PlayThrough:"https://www.youtube.com/watch?v=ZkMdXIuhMuI&feature=youtu.be"
    },
    desc: [
      `Mei is an interactive narrative installation that shines a spotlight on the educational inequities 
      faced by women in rural China. Combining Arduino-based sensors with ml5 gesture detection, the work creates 
      a layered interactive experience where visitors’ movements and touches generate different narrative paths 
      that ultimately converge on the same fate.`
    ],
    gallery: ["../assets/mei/1.png", "../assets/mei/2.png", "../assets/mei/3.png"]
  },

  "swinging-garden": {
    title: "Swinging Garden",
    facts: {
      Time: "2024",
      Type: "Creative Industrial Design",
      Medium: ["Wood","CNC","Industrial Modeling"],
      Tools: ["Fusion 360","Woodworking"]
    },
    desc: [
      `Swinging Garden was designed as a piece of creative furniture that offers a moment of rest, play, and relaxation amid the fast-paced rhythm of urban life and campus schedules. 
        Its smooth, rounded form ensures both aesthetic appeal and user safety. The internal support structure is shaped according to ergonomic curves derived from body data collected from more than twenty participants, providing precise support for the neck, waist, and legs to accommodate various comfortable sitting and reclining postures.
        The exterior features a vibrant green long-pile fabric, bringing freshness and vitality to the piece. 
        After being exhibited at NYU Shanghai, Swinging Garden was placed as a permanent installation on the third floor of the North Building, where it quickly became one of the most popular pieces of furniture on campus, frequently used and highly praised by students and visitors alike.`
    ],
    gallery: ["../assets/sg/1.png", "../assets/sg/2.png"]
  },

  "three": {
    title: "LAB 3",
    facts: {
      Time: "2024",
      Type: "Web-based Alternate Reality Meta Game",
      Medium: ["Web Game", "Physical Props"],
      Tools: ["JavaScript","Video"],
      PlayThrough:"https://www.youtube.com/watch?v=WrNvoVYpUO8&feature=youtu.be",
      Link:"https://maelynnnn.github.io/cclab/Project%20B/info/info.html"
    },
    desc: [
      `Lab 3 fabricates the history of Alternates (pseudo-humans) who began infiltrating and replacing 
      humanity since 2005. Its web-based form can outlive its creator, and this persistence, which mirrors how
       records survive and reshape truth after their makers disappear, serves as a powerful means to question
        the authenticity of history.`
    ],
    gallery: ["../assets/lab3/1.png", "../assets/lab3/2.png", "../assets/lab3/3.png", "../assets/lab3/4.png"]
  },

  "until-you": {
    title: "Until You",
    facts: {
      Time: "2025",
      Type: "Signal-responsive Web Installation",
      Medium: ["ESP 32", "Wi-Fi Signals", "Web Art"],
      Tools: ["JavaScript"]
    },
    desc: [
      `Until You is a digital installation that generates a localized Wi-Fi network via an ESP32, 
      carrying a webpage whose visibility and legibility shift with signal strength.
        By utilizing a locally autonomous Wi-Fi network, the project carries a webpage that employs rumors as its 
        circulating content. As signal strength weakens, these rumors gradually dissolve into garbled text and 
        random words, becoming increasingly unstable and unreliable. This exposes the fragility of the network and 
        its fundamental dependence on sustained human attention for visibility and existence.
        When no one chooses to connect, the work becomes entirely invisible, indistinguishable from a silent circuit board. Until you.`
    ],
    gallery: ["../assets/uy/1.png", "../assets/uy/2.png"]
  }
};

const key = new URLSearchParams(location.search).get("project");
const p = PROJECTS[key];

document.getElementById("pTitle").textContent = p.title;

document.getElementById("pFacts").innerHTML =
  Object.entries(p.facts).map(([k,v])=>{

    if (k === "PlayThrough") return "";

    if(Array.isArray(v)){
      return `
        <div class="fact">
          <span class="k">${k}</span>
          <div class="badges">${v.map(x=>`<span class="badge">${x}</span>`).join("")}</div>
        </div>`;
    }

    // ✅ Link: render as clickable <a>
    if(k === "Link" || k === "PlayThrough"){
      const url = String(v || "").trim();
      const safeUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      return `
        <div class="fact">
          <span class="k">${k}</span>
          <span class="v">
            <a class="fact-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
              ${url}
            </a>
          </span>
        </div>`;
    }

    return `<div class="fact"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  }).join("");


document.getElementById("pDesc").innerHTML =
  p.desc.map(d=>`<p>${d}</p>`).join("");


function getYouTubeId(url) {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }

    // youtube.com/embed/<id>
    const m = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (m) return m[1];

    return null;
  } catch (e) {
    return null;
  }
}

const playUrl = p.facts?.PlayThrough;
const videoWrap = document.getElementById("pVideo");

if (playUrl && videoWrap) {
  const vid = getYouTubeId(playUrl);
  if (vid) {
    videoWrap.hidden = false;
    videoWrap.innerHTML = `
      <div class="video-card">
        <div class="video-frame">
          <iframe
            src="https://www.youtube.com/embed/${vid}"
            title="Playthrough video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
  }
}


document.getElementById("pGallery").innerHTML =
  p.gallery.map(src=>`<img src="${src}" loading="lazy">`).join("");
