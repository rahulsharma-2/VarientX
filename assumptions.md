# Assumptions

- The core requirement is deterministic assignment for a given `user_id`, not a full-featured experimentation platform.
- A single active experiment is sufficient for the submission as long as the code is structured to extend cleanly.
- Returning frontend-facing config payloads per variant is desirable because the prompt mentions serving experiment configurations to frontend clients.
- Deterministic hashing is acceptable in place of persisted user assignment records because the prompt emphasizes consistent behavior across restarts, not manual reassignment workflows.
- The current experiment definition remains stable during evaluation. If the experiment key, traffic allocation, or assignment salt changes, some users may be rebucketed.
- `user_id` is treated as a required opaque identifier and normalized as a trimmed string.
- A lightweight demo UI is acceptable as optional reviewer convenience and does not replace the HTTP API.
- No external services, SaaS tools, or cloud dependencies are required to run or validate the solution locally.
