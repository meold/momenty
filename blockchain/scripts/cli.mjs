#!/usr/bin/env node

import path from 'path';
import {Command} from 'commander';
import chalk from 'chalk';
import colorize from 'json-colorizer';
import { MakeMoment } from './moment.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const colorizeOptions = {
    pretty: true,
    colors: {
        STRING_KEY: 'blue.bold',
        STRING_LITERAL: 'green'
    }
}

async function main() {
    const program = new Command()

    // commands
    program
        .command('mint <image-path> <video-path>')
        .description('create a new NFT')
        .option('-n, --name <name>', 'The name of the NFT')
        .option('-d, --description <desc>', 'A description of the NFT')
        .option('-o, --owner <address>', 'The ethereum address that should own the NFT.' +
            'If not provided, defaults to the first signing address.')
        .action(createNFT)

    program.command('show <token-id>')
        .description('get info about an NFT using its token ID')
        .option('-c, --creation-info', 'include the creator address and block number the NFT was minted')
        .action(getNFT)

    program.command('pin <token-id>')
        .description('"pin" the data for an NFT to a remote IPFS Pinning Service')
        .action(pinNFTData)

    // The hardhat and getconfig modules both expect to be running from the root directory of the project,
    // so we change the current directory to the parent dir of this script file to make things work
    // even if you call minty from elsewhere
    const rootDir = path.join(__dirname, '..')
    process.chdir(rootDir)

    await program.parseAsync(process.argv)
}

// ---- command action functions

async function createNFT(imagePath, videoPath, options) {
    const moment = await MakeMoment()

    const nft = await moment.createNFTFromAssetFile(imagePath, videoPath, options)
    console.log('🌿 Minted a new NFT: ')

    alignOutput([
        ['Token ID:', chalk.green(nft.tokenId)],
        ['Metadata Address:', chalk.blue(nft.metadataURI)],
        ['Metadata Gateway URL:', chalk.blue(nft.metadataGatewayURL)],
        ['Image Asset Address:', chalk.blue(nft.imageAssetURI)],
        ['Image Asset Gateway URL:', chalk.blue(nft.imageAssetGatewayURL)],
        ['Video Asset Address:', chalk.blue(nft.videoAssetURI)],
        ['Video Asset Gateway URL:', chalk.blue(nft.videoAssetGatewayURL)],
    ])
    console.log('NFT Metadata:')
    console.log(colorize(JSON.stringify(nft.metadata), colorizeOptions))
}

async function getNFT(tokenId, options) {
    const { creationInfo: fetchCreationInfo } = options
    const moment = await MakeMoment()
    const nft = await moment.getNFT(tokenId, {fetchCreationInfo})

    const output = [
        ['Token ID:', chalk.green(nft.tokenId)],
        ['Owner Address:', chalk.yellow(nft.ownerAddress)],
    ]
    if (nft.creationInfo) {
        output.push(['Creator Address:', chalk.yellow(nft.creationInfo.creatorAddress)])
        output.push(['Block Number:', nft.creationInfo.blockNumber])
    }
    output.push(['Metadata Address:', chalk.blue(nft.metadataURI)])
    output.push(['Metadata Gateway URL:', chalk.blue(nft.metadataGatewayURL)])
    output.push(['Asset Address:', chalk.blue(nft.assetURI)])
    output.push(['Asset Gateway URL:', chalk.blue(nft.assetGatewayURL)])
    alignOutput(output)

    console.log('NFT Metadata:')
    console.log(colorize(JSON.stringify(nft.metadata), colorizeOptions))
}

async function pinNFTData(tokenId) {
    const moment = await MakeMoment()
    await moment.pinTokenData(tokenId)
    console.log(`🌿 Pinned all data for token id ${chalk.green(tokenId)}`)
}

// ---- helpers

function alignOutput(labelValuePairs) {
    const maxLabelLength = labelValuePairs
      .map(([l, _]) => l.length)
      .reduce((len, max) => len > max ? len : max)
    for (const [label, value] of labelValuePairs) {
        console.log(label.padEnd(maxLabelLength+1), value)
    }
}

// ---- main entry point when running as a script

// make sure we catch all errors
main().then(() => {
    process.exit(0)
}).catch(err => {
    console.error(err)
    process.exit(1)
})
