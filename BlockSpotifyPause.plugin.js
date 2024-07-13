/**
 * @name BlockSpotifyPause
 * @version 1.0.4
 * @description Blocks requests to the Spotify pause endpoint.
 * @autor Rnicholas#2092
 */

const config = {
    info: {
        name: "BlockSpotifyPause",
        authors: [
            {
                name: "Rnicholas#2092",
                discord_id: "627578410729996294",
                github_username: "ColdFusion001"
            }
        ],
        version: "1.0.4",
        description: "Blocks requests to the Spotify pause endpoint.",
        github: "https://github.com/ColdFusion001",
        github_raw: "https://raw.githubusercontent.com/ColdFusion001/NoSpotifyPauseBD/main/BlockSpotifyPause.plugin.js"
    }
};

module.exports = (() => {
    return class BlockSpotifyPause {
        constructor() {
            this.originalFetch = null;
            this.originalXhrOpen = null;
        }

        start() {
            this.patchFetch();
            this.patchXhr();
            console.log(`[${config.info.name}] Plugin started`);
        }

        stop() {
            this.unpatchFetch();
            this.unpatchXhr();
            console.log(`[${config.info.name}] Plugin stopped`);
        }

        patchFetch() {
            this.originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const url = args[0];
                if (typeof url === 'string' && url.includes('https://api.spotify.com/v1/me/player/pause')) {
                    console.log(`[${config.info.name}] Blocked request to: ${url}`);
                    return new Response(null, { status: 204 });
                }
                return this.originalFetch(...args);
            };
            console.log(`[${config.info.name}] Patched fetch function`);
        }

        unpatchFetch() {
            if (this.originalFetch) {
                window.fetch = this.originalFetch;
                this.originalFetch = null;
                console.log(`[${config.info.name}] Unpatched fetch function`);
            }
        }

        patchXhr() {
            const self = this;
            this.originalXhrOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, ...args) {
                if (typeof url === 'string' && url.includes('https://api.spotify.com/v1/me/player/pause')) {
                    console.log(`[${config.info.name}] Blocked XMLHttpRequest to: ${url}`);
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === 1) {
                            this.abort();
                        }
                    });
                } else {
                    self.originalXhrOpen.call(this, method, url, ...args);
                }
            };
            console.log(`[${config.info.name}] Patched XMLHttpRequest open method`);
        }

        unpatchXhr() {
            if (this.originalXhrOpen) {
                XMLHttpRequest.prototype.open = this.originalXhrOpen;
                this.originalXhrOpen = null;
                console.log(`[${config.info.name}] Unpatched XMLHttpRequest open method`);
            }
        }
    };
})();
