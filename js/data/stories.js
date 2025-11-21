/**
 * StoryForge - Story Data
 * Define characters, narratives, and achievements here
 */

export const THEMES = {
    fantasy: {
        id: 'fantasy',
        name: 'Fantasy',
        icon: '✨'
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        icon: '🌑'
    },
    celestial: {
        id: 'celestial',
        name: 'Celestial',
        icon: '🌟'
    }
};

export const CHARACTERS = {
    knight: {
        name: 'Knight',
        description: 'Honor, courage, and steel',
        colorClass: 'color-amber',
        iconPath: '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M3 3l7.586 7.586M11 11l6 6M17 11l-2.5 2.5"/>',
        stats: {
            strength: 9,
            magic: 2,
            luck: 5
        }
    },
    mage: {
        name: 'Mage',
        description: 'Infinite arcane knowledge',
        colorClass: 'color-violet',
        iconPath: '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M12.2 11.8L11 13M12.2 6.2L11 5M15 16a4 4 0 100-8 4 4 0 000 8zM6 21l3-9 3 9M7.5 18h3"/>',
        stats: {
            strength: 3,
            magic: 10,
            luck: 4
        }
    },
    rogue: {
        name: 'Rogue',
        description: 'Shadows are allies',
        colorClass: 'color-emerald',
        iconPath: '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 9h.01M15 9h.01M8 13c1.5 2 6.5 2 8 0"/>',
        stats: {
            strength: 5,
            magic: 4,
            luck: 8
        }
    }
};

export const STORIES = {
    default: {
        meta: {
            title: 'Chronicles of Valdren',
            description: 'An epic adventure in a kingdom threatened by ancient forces',
            version: '1.0.0'
        },
        
        characters: CHARACTERS,
        
        nodes: {
            knight: {
                start: {
                    text: 'The walls of Valdren Castle tremble. An ancient dragon awakens after centuries of slumber, and you, the last Knight of the Solar Order, are summoned by the dying king. The crown weighs heavy on your head even before touching it.',
                    choices: [
                        { text: 'Accept the mission with honor', next: 'accept_quest', effect: '+10 Honor' },
                        { text: 'Negotiate reward first', next: 'negotiate', effect: '+5 Gold' }
                    ]
                },
                accept_quest: {
                    text: 'The king gifts you the Auroreal Sword, forged in sacred flames generations ago. At the castle exit, the forbidden forest awaits. Two paths reveal themselves: one bathed in divine light, another covered in impenetrable mist.',
                    choices: [
                        { text: 'Follow the sacred light', next: 'light_path', effect: '+5 Faith' },
                        { text: 'Investigate the mysterious mist', next: 'mist_path', effect: '+5 Knowledge' }
                    ]
                },
                negotiate: {
                    text: 'The king laughs at your audacity, but there is respect in his tired eyes. He offers fertile lands and a noble title. As they seal the agreement, a messenger bursts into the hall: the dragon has attacked a nearby village. Screams echo beyond the mountains.',
                    choices: [
                        { text: 'Depart immediately', next: 'rush_village', effect: '+15 Heroism' },
                        { text: 'Gather troops first', next: 'gather_troops', effect: '+10 Strategy' }
                    ]
                },
                light_path: {
                    text: 'The illuminated path reveals a sanctuary forgotten by time. Ancient runes glow on the walls. A guardian spirit materializes, offering a choice: the blessing of divine protection or the gift of seeing beyond the veil of time.',
                    choices: [
                        { text: 'Accept the protection', next: 'ending_blessed', effect: 'Divine Shield' },
                        { text: 'Receive the vision of the future', next: 'ending_seer', effect: 'Prescience' }
                    ]
                },
                mist_path: {
                    text: 'In the dense mist, a figure emerges. Your heart freezes recognizing the armor: it is your old master, Sir Aldric, given up for dead years ago. But his eyes are empty, consumed by dark magic. He raises his sword without recognizing you.',
                    choices: [
                        { text: 'Try to free him from the curse', next: 'ending_redemption', effect: 'Redemption' },
                        { text: 'Face him in honorable duel', next: 'ending_duel', effect: 'Final Duel' }
                    ]
                },
                rush_village: {
                    text: 'You ride through the night. The village burns when you arrive, but it is not too late. Among smoking rubble, you find survivors. A child holds something against their chest: a dragon egg, pulsing with heat. The offspring of the monster that destroyed everything.',
                    choices: [
                        { text: 'Destroy the egg', next: 'ending_destroyer', effect: 'End of the Lineage' },
                        { text: 'Protect the child and the egg', next: 'ending_guardian', effect: 'New Beginning' }
                    ]
                },
                gather_troops: {
                    text: 'With an army at your back, you march to the dragon\'s cave. The creature does not attack. Instead, it speaks. Its voice echoes like thunder: "I am not the enemy. I was awakened by mages who desire war between kingdoms. They manipulate all of you."',
                    choices: [
                        { text: 'Form alliance with the dragon', next: 'ending_alliance', effect: 'Ancient Pact' },
                        { text: 'Destroy the threat', next: 'ending_slayer', effect: 'Eternal Legend' }
                    ]
                },
                ending_blessed: {
                    text: 'With divine protection enveloping your soul, you face the dragon in singular battle. Flames lick your armor without causing harm. The creature falls. Temples are erected in your honor, and your name becomes synonymous with unwavering faith. You are the Blessed Knight, eternal protector of Valdren.',
                    ending: true,
                    title: 'The Blessed'
                },
                ending_seer: {
                    text: 'The vision reveals the truth: the dragon is not an enemy, but guardian of a dimensional rift. United, you seal the opening that threatened to swallow the world. Prophecies speak of you as the Seer, the one who looked beyond time and saved all futures.',
                    ending: true,
                    title: 'The Seer'
                },
                ending_redemption: {
                    text: 'Your voice pierces the darkness. You speak of shared memories, lessons learned, of honor. Tears stream from Sir Aldric\'s dead eyes. The curse breaks. With his last free breath, he delivers his sword and thanks you for the liberation. You carry his legacy forever.',
                    ending: true,
                    title: 'The Redeemer'
                },
                ending_duel: {
                    text: 'The duel is brutal and silent. Two sword masters, united by the past, separated by dark magic. When your blade pierces his heart, light briefly returns to his eyes. "Thank you," he whispers. The swords fuse, creating the legendary Twin Blade.',
                    ending: true,
                    title: 'Blade Master'
                },
                ending_destroyer: {
                    text: 'The egg shatters under your boot. Deathly silence falls over the world. The adult dragon senses its child\'s death and attacks with blind fury. You defeat it, but there is no glory. The world\'s oldest species is extinct by your hands. Victory tastes of ashes.',
                    ending: true,
                    title: 'The Exterminator'
                },
                ending_guardian: {
                    text: 'The adult dragon emerges from the clouds, ready to destroy everything. But it sees you protecting its offspring. The beast hesitates. Years later, you ride the sky on the young dragon you raised. The Era of Winged Knights begins, and you are its first guardian.',
                    ending: true,
                    title: 'The Winged Guardian'
                },
                ending_alliance: {
                    text: 'The pact is sealed in ancient fire and knight\'s blood. Dragon and human march together against the true enemies. The conspiring mages fall. A new world order arises, where the two most powerful races coexist. You are remembered as the Pact Forger.',
                    ending: true,
                    title: 'Pact Forger'
                },
                ending_slayer: {
                    text: 'The battle is legendary. Songs will be written about each blow. The dragon falls, and your name echoes for generations as the greatest dragon slayer who ever lived. But in quiet nights, the creature\'s words haunt you. The true war is yet to come.',
                    ending: true,
                    title: 'Dragon Slayer'
                }
            },

            mage: {
                start: {
                    text: 'The Arcane Tower pulses with unstable energy. Crystals that floated for centuries now tremble. Your mentor, Archmage Seraphis, has disappeared into the Ethereal Veil, leaving only a blood-sealed grimoire and a warning etched in fire: "The Devourer awakens."',
                    choices: [
                        { text: 'Open the forbidden grimoire', next: 'open_grimoire', effect: '+10 Forbidden Knowledge' },
                        { text: 'Seek the mentor in the Veil', next: 'enter_veil', effect: '+10 Determination' }
                    ]
                },
                open_grimoire: {
                    text: 'The blood seal recognizes your lineage. The pages reveal rituals to control the Devourer, but demand a price. A specter emerges from the book, offering options: sacrifice your memories, your life force, or absorb a corrupted soul it guards.',
                    choices: [
                        { text: 'Sacrifice memories', next: 'sacrifice_memory', effect: '-Memories +Power' },
                        { text: 'Absorb the corrupted soul', next: 'absorb_soul', effect: '+Dark Power' }
                    ]
                },
                enter_veil: {
                    text: 'The Ethereal Veil is a labyrinth of broken realities. Fragments of worlds float like islands in an ocean of nothing. You find Seraphis, but something is wrong. He speaks in riddles, his eyes glow with alien light, and his words don\'t match your memories.',
                    choices: [
                        { text: 'Trust and follow his instructions', next: 'trust_mentor', effect: 'Blind Faith' },
                        { text: 'Test if it is really him', next: 'test_mentor', effect: 'Wise Caution' }
                    ]
                },
                sacrifice_memory: {
                    text: 'Your memories dissipate like smoke. Beloved faces become blurs. Your own name escapes you. But immense power flows in its place. The Devourer laughs in your mind, for now you no longer remember what you swore to protect.',
                    choices: [
                        { text: 'Use the power for good', next: 'ending_hollow_hero', effect: 'Absolute Sacrifice' },
                        { text: 'Accept the darkness', next: 'ending_dark_lord', effect: 'Transformation' }
                    ]
                },
                absorb_soul: {
                    text: 'The soul belonged to Malachar, the Mad Archmage. His wisdom and madness now inhabit you. Voices whisper cosmic secrets. You see invisible patterns in reality\'s fabric. But the voices never stop, and some suggest terrible things.',
                    choices: [
                        { text: 'Master the voices', next: 'ending_dual_soul', effect: 'Mental Mastery' },
                        { text: 'Free the soul after using its knowledge', next: 'ending_exorcist', effect: 'Compassion' }
                    ]
                },
                trust_mentor: {
                    text: 'Seraphis guides you to the Veil\'s heart, where the Devourer sleeps in chains of ancient light. Your mentor transforms, revealing the truth: he is the guardian, not the prisoner. And you, his most perfect creation, are the key to finally free him.',
                    choices: [
                        { text: 'Free the Devourer', next: 'ending_apocalypse', effect: 'End Times' },
                        { text: 'Seal both forever', next: 'ending_eternal_prison', effect: 'Eternal Sacrifice' }
                    ]
                },
                test_mentor: {
                    text: 'You recite a revelation enchantment. The illusion shatters. The creature wearing Seraphis\'s form roars in fury. In the shadows behind it, you see your true mentor: imprisoned in crystal, but still alive, eyes begging for rescue.',
                    choices: [
                        { text: 'Destroy the entity', next: 'ending_banisher', effect: 'Banishment' },
                        { text: 'Negotiate for his freedom', next: 'ending_bargain', effect: 'Dangerous Pact' }
                    ]
                },
                ending_hollow_hero: {
                    text: 'Without memories, you become a pure force of protection. The Devourer is sealed, the world is saved, but no one knows your name. You wander eternally through paths between worlds, a hero without history, a legend without face. The ultimate sacrifice.',
                    ending: true,
                    title: 'Nameless Hero'
                },
                ending_dark_lord: {
                    text: 'Power consumes what remains of you. The Devourer finds in your empty body the perfect host. Eras of darkness begin, and the name you forgot becomes synonymous with absolute terror. The world burns in black fire.',
                    ending: true,
                    title: 'Dark Lord'
                },
                ending_dual_soul: {
                    text: 'Two minds, one body. Malachar\'s madness is tamed by your discipline. You become the most powerful mage who ever existed, capable of magic impossible for a single being. The Academy bows before your dual wisdom, and the Devourer never awakens.',
                    ending: true,
                    title: 'Twin Soul'
                },
                ending_exorcist: {
                    text: 'You use Malachar\'s knowledge and then, with delicate ritual, free his tormented soul. Grateful, he voluntarily reveals the final secret before departing beyond. You become the world\'s greatest exorcist, guiding lost souls to rest.',
                    ending: true,
                    title: 'Soul Guide'
                },
                ending_apocalypse: {
                    text: 'The Devourer awakens. Realities bend. But instead of destruction, it reconfigures the world. Ancient magic returns to the land. You become its herald, announcing a new era where mortals and cosmic entities coexist. The price was high, but the future is unlimited.',
                    ending: true,
                    title: 'Herald of the Devourer'
                },
                ending_eternal_prison: {
                    text: 'You merge with the Veil, becoming the new guardian. Your physical body becomes a statue in the Arcane Tower, visited by apprentices who will never know your sacrifice. Seraphis is freed to tell your story. For all eternity, you watch the Devourer.',
                    ending: true,
                    title: 'Eternal Guardian'
                },
                ending_banisher: {
                    text: 'The arcane battle tears the Veil\'s fabric. Lightning bolts of pure will collide. When the entity finally dissipates, Seraphis is freed, though gravely wounded. Together, you rebuild the Arcane Tower, stronger and wiser.',
                    ending: true,
                    title: 'The Banisher'
                },
                ending_bargain: {
                    text: 'The entity accepts: forbidden knowledge in exchange for your mentor\'s life. The pact is sealed. Years later, you discover the true price: the entity now inhabits your dreams. But Seraphis lives, and you learned to sleep with eyes open.',
                    ending: true,
                    title: 'Pact Maker'
                }
            },

            rogue: {
                start: {
                    text: 'The Shadow Guild has been betrayed. Bodies of your companions lie in the secret hall that was your home. The traitor fled with the Obsidian Heart, a relic that allows control of shadows themselves. You survived by being on a mission. Now, only vengeance remains.',
                    choices: [
                        { text: 'Hunt the traitor alone', next: 'hunt_alone', effect: '+10 Determination' },
                        { text: 'Seek allies in the streets', next: 'seek_allies', effect: '+10 Connections' }
                    ]
                },
                hunt_alone: {
                    text: 'The trail leads to sewers beneath the royal palace. The traitor serves the corrupt prince, trading the relic for political power. In the tunnels, you find compromising documents: evidence that could topple the crown or yield a fortune in blackmail.',
                    choices: [
                        { text: 'Expose corruption to the people', next: 'expose_truth', effect: '+15 Justice' },
                        { text: 'Blackmail for personal profit', next: 'blackmail', effect: '+15 Gold' }
                    ]
                },
                seek_allies: {
                    text: 'In the streets, old rivals offer help, but nothing is free. The Red Mercenaries Guild promises brute force in exchange for future territory. The Eyes of Night, master spies, offer information for an unrevealed favor.',
                    choices: [
                        { text: 'Accept the Mercenaries', next: 'mercenary_path', effect: '+Military Force' },
                        { text: 'Accept the Eyes of Night', next: 'spy_path', effect: '+Informant Network' }
                    ]
                },
                expose_truth: {
                    text: 'Truth spreads like fire. The people revolt. The prince is deposed. In the chaos of burning streets, you find the traitor trying to escape, pathetic and defeated, begging for mercy. The dagger in your hand is ready.',
                    choices: [
                        { text: 'Grant mercy', next: 'ending_merciful', effect: 'Clemency' },
                        { text: 'Deliver shadow justice', next: 'ending_executioner', effect: 'Execution' }
                    ]
                },
                blackmail: {
                    text: 'The prince pays generously for your silence. But princes don\'t forget humiliations. Assassins come at night. You survive, but a truth crystallizes: while he lives, you will have no peace.',
                    choices: [
                        { text: 'Eliminate the prince', next: 'ending_kingslayer', effect: 'Regicide' },
                        { text: 'Flee to distant lands', next: 'ending_exile', effect: 'Golden Exile' }
                    ]
                },
                mercenary_path: {
                    text: 'With brute force, you storm the traitor\'s hideout. But it was a trap. He expected a direct attack. The Obsidian Heart pulses in his chest, and shadows around come alive, attacking your mercenary allies.',
                    choices: [
                        { text: 'Face the shadows', next: 'ending_shadow_war', effect: 'War in Darkness' },
                        { text: 'Destroy the Heart', next: 'ending_destroyer_rogue', effect: 'End of Shadows' }
                    ]
                },
                spy_path: {
                    text: 'Information is the ultimate weapon. The Eyes reveal the traitor was manipulated, a puppet. Something ancient and hungry hides in the shadows, using humans as pawns. The true enemy is not mortal.',
                    choices: [
                        { text: 'Hunt the entity', next: 'ending_entity_hunter', effect: 'Hunter from Beyond' },
                        { text: 'Free the traitor from influence', next: 'ending_savior', effect: 'Unlikely Redemption' }
                    ]
                },
                ending_merciful: {
                    text: 'Your hand hesitates. You spare the traitor. Years later, he becomes your most loyal lieutenant, consumed by gratitude and guilt. Together, you rebuild the Shadow Guild as a force of clandestine justice. Mercy bred the most faithful ally.',
                    ending: true,
                    title: 'Merciful Master'
                },
                ending_executioner: {
                    text: 'The blade finds his throat. You whisper the names of the dead as life escapes his eyes. Vengeance is complete, but emptiness remains. You assume control of the underworld, feared and respected, but eternally alone.',
                    ending: true,
                    title: 'Shadow Executioner'
                },
                ending_kingslayer: {
                    text: 'The prince dies on his own throne, never knowing who wielded the dagger. The kingdom plunges into civil war over succession. In chaos, you thrive, becoming a whispered legend: the ghost who toppled a crown.',
                    ending: true,
                    title: 'Kingslayer'
                },
                ending_exile: {
                    text: 'With extorted fortune, you sail to unknown lands. New identity, new life. The past becomes a distant dream. On a golden coast, you build a commercial empire, never forgetting the shadows you came from.',
                    ending: true,
                    title: 'Golden Ghost'
                },
                ending_shadow_war: {
                    text: 'Shadows respond to you too, blood of the ancient Guild. War is waged in a dimension where light doesn\'t exist. In the end, you emerge victorious, the Obsidian Heart fused in your chest. Lord of Shadows, master of the invisible.',
                    ending: true,
                    title: 'Shadow Lord'
                },
                ending_destroyer_rogue: {
                    text: 'You shatter the Heart. Shadow magic dissipates from the world. Thieves lose their gifts, assassins become ordinary mortals. You destroyed your own legacy to save others. Unwitting hero of an era that will never know your name.',
                    ending: true,
                    title: 'Legacy Destroyer'
                },
                ending_entity_hunter: {
                    text: 'The hunt for the dark being consumes years. You learn forbidden rituals, cross dimensions, lose parts of yourself. When you finally destroy it, you realize you transcended mortality. Guardian between worlds, eternal hunter of cosmic horrors.',
                    ending: true,
                    title: 'Dimensional Hunter'
                },
                ending_savior: {
                    text: 'The traitor, freed from alien influence, collapses in tears. He doesn\'t remember the murders, only the horror of being prisoner in his own body. Together, you destroy the entity. The Guild is reborn with purpose: protect against the supernatural.',
                    ending: true,
                    title: 'Savior of Lost Souls'
                }
            }
        },

        achievements: {
            blessed_ending: { name: 'Unwavering Faith', description: 'Complete the story as the Blessed Knight', icon: '🛡️' },
            seer_ending: { name: 'Eyes of Tomorrow', description: 'Complete the story as the Seer', icon: '👁️' },
            dark_lord_ending: { name: 'Embrace of Darkness', description: 'Become the Dark Lord', icon: '👑' },
            all_knight_endings: { name: 'Complete Order', description: 'Unlock all Knight endings', icon: '⚔️' },
            all_mage_endings: { name: 'Absolute Arcane', description: 'Unlock all Mage endings', icon: '🔮' },
            all_rogue_endings: { name: 'Shadow Master', description: 'Unlock all Rogue endings', icon: '🗡️' },
            speed_run: { name: 'Lightning', description: 'Complete a story in under 2 minutes', icon: '⚡' }
        }
    }
};