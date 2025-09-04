import React, { useState } from "react";

const QUESTIONS = [
    {
        label: "What's your software idea?",
        description:
            "Describe your software concept in detail. What would it do?",
        placeholder:
            "e.g. A task management app that integrates with your calendar",
        key: "idea",
        required: true,
    },
    {
        label: "What problem would it solve?",
        description: "Explain the problem your idea addresses.",
        placeholder:
            "e.g. It helps users organize their tasks more effectively.",
        key: "problem",
        required: true,
    },
    {
        label: "What platform would it be on?",
        description: "Select your target platform.",
        key: "platform",
        required: true,
        options: [
            { value: "Browser", icon: "🌐" },
            { value: "iOS", icon: "🍎" },
            { value: "Android", icon: "🤖" },
            { value: "Windows", icon: "🪟" },
            { value: "Mac", icon: "🖥️" },
            { value: "Linux", icon: "🐧" },
            { value: "Other", icon: "✏️" },
        ],
    },
    {
        label: "Any unique features?",
        description: "Share what sets your idea apart.",
        key: "unique",
        required: false,
    },
];

const DISCORD_WEBHOOK_URL = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

function sendToDiscord(data) {
    const embed = {
        title: "New Software Idea Submission",
        fields: Object.entries(data.answers).map(([name, value]) => ({
            name,
            value: value || "(No answer)",
            inline: false,
        })),
        footer: { text: `${data.notification}` },
        color: 0xef88f8,
    };

    return fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
    });
}

export default function SoftwareIdeaForm() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({ platform: [] });
    const [notificationMethod, setNotificationMethod] = useState("");
    const [notificationValue, setNotificationValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step < QUESTIONS.length) {
            const q = QUESTIONS[step];
            if (q.required) {
                if (
                    q.key === "platform" &&
                    (!answers.platform ||
                        answers.platform.length === 0 ||
                        (answers.platform.includes("Other") &&
                            !answers.platformOther))
                ) {
                    setError("Please select at least one platform.");
                    return;
                }
                if (q.key !== "platform" && !answers[q.key]) {
                    setError("This field is required.");
                    return;
                }
            }
            setError("");
            setStep(step + 1);
        } else {
            // Notification step
            if (notificationMethod === "email") {
                if (!notificationValue.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                    setError("Please enter a valid email address.");
                    return;
                }
            } else if (notificationMethod === "discord") {
                if (!notificationValue.match(/^.{2,}$/)) {
                    setError("Please enter a valid Discord username or tag.");
                    return;
                }
            } else if (notificationMethod === "other") {
                if (!notificationValue.trim()) {
                    setError(
                        "Please enter your preferred notification method."
                    );
                    return;
                }
            }
            setError("");
            setLoading(true);
            // Prepare platform answer for Discord
            let platformAnswer = answers.platform
                ? answers.platform.join(", ")
                : "";
            if (answers.platform.includes("Other") && answers.platformOther) {
                platformAnswer += ` (Other: ${answers.platformOther})`;
            }
            const discordAnswers = { ...answers, platform: platformAnswer };
            delete discordAnswers.platformOther;
            sendToDiscord({
                answers: discordAnswers,
                notification: `${notificationMethod}: ${notificationValue}`,
            })
                .then(() => {
                    setSubmitted(true);
                })
                .catch(() => {
                    setError("Failed to submit. Please try again later.");
                })
                .finally(() => setLoading(false));
        }
    };
    const handleRestart = () => {
        setStep(0);
        setAnswers({ platform: [] });
        setNotificationMethod("");
        setNotificationValue("");
        setSubmitted(false);
        setError("");
        setLoading(false);
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    if (submitted) {
        return (
            <div className="form-container">
                <h2>Thank you for sharing your idea!</h2>
                <p>
                    If your idea gets developed by Jay, you'll be notified via
                    your chosen method.
                </p>
                <a
                    className="portfolio-link"
                    href="https://portfolio.nexusgit.info"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visit Jay's Portfolio
                </a>
                <div className="form-actions" style={{ marginTop: "2rem" }}>
                    <button onClick={handleRestart}>Submit Another Idea</button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-root">
            <div className="header-container">
                <h1 className="header-title">Software Idea Collection</h1>
                <p className="muted">
                    Share your software ideas with Jay. If your idea gets
                    developed, you'll be notified!
                </p>
                <div>
                    <p>
                        Question:{" "}
                        {step < QUESTIONS.length
                            ? step + 1
                            : QUESTIONS.length + 1}{" "}
                        of {QUESTIONS.length + 1}
                    </p>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${
                                    ((step + 1) / (QUESTIONS.length + 1)) * 100
                                }%`,
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="form-container">
                {step < QUESTIONS.length ? (
                    <>
                        <h2>{QUESTIONS[step].label}</h2>
                        <p className="muted">{QUESTIONS[step].description}</p>
                        {QUESTIONS[step].key === "platform" ? (
                            <>
                                <div className="platform-options">
                                    {QUESTIONS[step].options.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`platform-option${
                                                answers.platform &&
                                                answers.platform.includes(
                                                    opt.value
                                                )
                                                    ? " selected"
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name="platform"
                                                value={opt.value}
                                                checked={
                                                    answers.platform &&
                                                    answers.platform.includes(
                                                        opt.value
                                                    )
                                                }
                                                onChange={(e) => {
                                                    let newPlatforms =
                                                        Array.isArray(
                                                            answers.platform
                                                        )
                                                            ? [
                                                                  ...answers.platform,
                                                              ]
                                                            : [];
                                                    if (e.target.checked) {
                                                        newPlatforms.push(
                                                            opt.value
                                                        );
                                                    } else {
                                                        newPlatforms =
                                                            newPlatforms.filter(
                                                                (v) =>
                                                                    v !==
                                                                    opt.value
                                                            );
                                                    }
                                                    setAnswers({
                                                        ...answers,
                                                        platform: newPlatforms,
                                                    });
                                                }}
                                            />
                                            <span className="platform-icon">
                                                {opt.icon}
                                            </span>
                                            <span className="platform-label">
                                                {opt.value}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {answers.platform &&
                                    answers.platform.includes("Other") && (
                                        <textarea
                                            value={answers.platformOther || ""}
                                            onChange={(e) =>
                                                setAnswers({
                                                    ...answers,
                                                    platformOther:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Please specify other platform"
                                            style={{
                                                width: "100%",
                                                marginTop: "0.5rem",
                                            }}
                                        />
                                    )}
                            </>
                        ) : (
                            <textarea
                                value={answers[QUESTIONS[step].key] || ""}
                                onChange={(e) =>
                                    setAnswers({
                                        ...answers,
                                        [QUESTIONS[step].key]: e.target.value,
                                    })
                                }
                                placeholder={QUESTIONS[step].label}
                                rows={4}
                                required={QUESTIONS[step].required}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <h2>How would you like to be notified?</h2>
                        <p>
                            Choose your preferred notification method. If your
                            idea gets developed by Jay, you'll be notified!
                        </p>
                        <div
                            className="notification-methods"
                            style={{ marginBottom: "1rem" }}
                        >
                            <label
                                style={{ marginRight: "1.5rem" }}
                                className={
                                    notificationMethod === "email"
                                        ? "notif-selected"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="notificationMethod"
                                    value="email"
                                    checked={notificationMethod === "Email"}
                                    onChange={() =>
                                        setNotificationMethod("Email")
                                    }
                                />{" "}
                                Email
                            </label>
                            <label
                                style={{ marginRight: "1.5rem" }}
                                className={
                                    notificationMethod === "Discord"
                                        ? "notif-selected"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="notificationMethod"
                                    value="discord"
                                    checked={notificationMethod === "Discord"}
                                    onChange={() =>
                                        setNotificationMethod("Discord")
                                    }
                                />{" "}
                                Discord
                            </label>
                            <label
                                className={
                                    notificationMethod === "Other"
                                        ? "notif-selected"
                                        : ""
                                }
                            >
                                <input
                                    type="radio"
                                    name="notificationMethod"
                                    value="other"
                                    checked={notificationMethod === "Other"}
                                    onChange={() =>
                                        setNotificationMethod("Other")
                                    }
                                />{" "}
                                Other
                            </label>
                        </div>
                        {notificationMethod === "Email" && (
                            <textarea
                                type="email"
                                value={notificationValue}
                                onChange={(e) =>
                                    setNotificationValue(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />
                        )}
                        {notificationMethod === "Discord" && (
                            <textarea
                                type="text"
                                value={notificationValue}
                                onChange={(e) =>
                                    setNotificationValue(e.target.value)
                                }
                                placeholder="Enter your Discord Username or User ID"
                                required
                            />
                        )}
                        {notificationMethod === "Other" && (
                            <textarea
                                type="text"
                                value={notificationValue}
                                onChange={(e) =>
                                    setNotificationValue(e.target.value)
                                }
                                placeholder="Enter your preferred notification method (e.g. Telegram, SMS)"
                                required
                            />
                        )}
                    </>
                )}
                {error && <div className="error">{error}</div>}
                <div className="form-actions">
                    <button
                        onClick={handlePrev}
                        disabled={step === 0 || loading}
                    >
                        Previous
                    </button>
                    <button onClick={handleNext} disabled={loading}>
                        {step < QUESTIONS.length
                            ? "Next"
                            : loading
                            ? "Submitting..."
                            : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}
