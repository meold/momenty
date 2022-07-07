<template>
  <h3>{{ status }}</h3>
  <div v-if="online" class="ipfs-info">
    <h3>
      ID: <span id="ipfs-info-id">{{ id }}</span>
    </h3>
    <h3>
      Agent version: <span id="ipfs-info-agent">{{ agentVersion }}</span>
    </h3>
  </div>
  <div>

    <input type="file" @change="uploadFile($event)">

    <img v-if="fileUrl" :src="fileUrl" alt="">

  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "Connecting to IPFS...",
      id: "",
      agentVersion: "",
      online: false,
      file: null
    };
  },

  computed: {
    fileUrl() {
      return this.file ? `https://ipfs.io/ipfs/${this.file.cid}` : null;
    }
  },

  mounted() {
    this.getIpfsNodeInfo();
  },

  methods: {
    async getIpfsNodeInfo() {
      try {
        // Await for ipfs node instance.
        const ipfs = await this.$ipfs;
        // Call ipfs `id` method.
        // Returns the identity of the Peer.
        const { agentVersion, id } = await ipfs.id();
        this.agentVersion = agentVersion;
        this.id = id;
        // Set successful status text.
        this.status = "Connected to IPFS =)";
        this.online = ipfs.isOnline();
      } catch (err) {
        // Set error status text.
        this.status = `Error: ${err}`;
      }
    },

    async uploadFile(e) {
      const file = e.target.files[0];
      const ipfs = await this.$ipfs;
      try {
        this.status = "Uploading to IPFS..."
        this.file = await ipfs.add(file);
      } catch (err) {
        console.log(err);
      }

      console.log(this.file.cid.toString());

      // FIXME: make fileUrl works
    }
  }
};
</script>
