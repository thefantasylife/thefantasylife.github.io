const Li_Dailin = {
     Attack_Power: 33
    ,Attack_Power_Growth: 1.9
    ,Health: 550
    ,Health_Growth: 84
    ,Health_Regen: 1.1
    ,Health_Regen_Growth: 0.07
    ,Stamina: 420
    ,Stamina_Growth: 16
    ,Stamina_Regen: 0.2
    ,Stamina_Regen_Growth: 0.01
    ,Defense: 20
    ,Defense_Growth: 2.5
    ,Atk_Speed: 0.07
    ,Crit_Rate: 0
    ,Move_Speed: 3.1
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Glove, Nunchaku]
    ,correction: {
        Glove: [
            [0, 0, 0],
            [0, 0, 0]
        ],
        Nunchaku: [
            [3, 3, 3],
            [0, 0, 0]
        ]
    }
    ,Base_Attack: (character, enemy) => {
        if (character.weapon) {
            const damage = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const min = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const max = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            return "<b class='damage'>" + damage + '</b> ( ' +  min + ' - ' + max + ' )';
        }
        return '-';
    }
    ,Base_Attack_Option: ''
    ,DPS: (character, enemy) => {
        if (character.weapon) {
            const ba = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const damage = round(ba * character.attack_speed * 100) / 100;
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            return "<b class='damage'>" + damage + "</b><b> __h/s: </b><b class='heal'>" + life + '</b>';
        }
        return '-';
    }
    ,DPS_Option: ''
    ,HPS: (character, enemy) => {
        return "<b class='heal'>" + calcHeal(character.hp_regen * (character.hp_regen_percent + 100) / 100 + 
            (character.food ? character.food.HP_Regen / 30 : 0), 2, enemy) + '</b>';
    }
    ,Q_Skill: (character, enemy) => {
        if (character.weapon) {
            const q = character.Q_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, 20 + q * 20, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 28 + q * 28, 0.7, 1);
            const cool = 10000 / ((12 - q * 0.5) * (100 - character.cooldown_reduction) + 28);
            return "<b class='damage'>" + max * 3 + '</b> ( ' + min + ', ' + min + ', ' + min + ' - ' + max + ', ' + max + ', ' + max + " )<b> __sd/s: </b><b class='damage'>" + round((max * 3) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const damage1 = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const damage2 = baseAttackDamage(character, enemy, 0, 0.5 + character.T_LEVEL.selectedIndex * 0.25, character.critical_strike_chance, 1);
            const dps = round((damage1 + damage2) * character.attack_speed * 100) / 100;
            const life = calcHeal((damage1 + damage2) * (character.life_steal / 100), character.attack_speed, enemy);	
            return "<b> _d/s: </b><b class='damage'>" + dps + "</b><b> __h/s: </b><b class='heal'>" + life + '</b>';
        }
        return '-';
    }
    ,W_Option: "<b> __use</b><input type='checkbox' class='lida_w' onchange='updateDisplay()'>"
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const damage = calcSkillDamage(character, enemy, 80 + e * 55, 0.5, 1);
            const cool = 10000 / ((13 - e * 1) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, 40 + r * 30, 0.2, 1);
            let max, over;
            if (enemy.max_hp) {
                const hp = enemy.max_hp;
                const heal = calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                    (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character);
                let start = 0, mid, end = (hp * 0.77 | 0) + 1, coe;
                while (start < end) {
                    mid = (start + end + 1) / 2;
                    coe = 2 * (mid * 100.0 / hp > 77 ? 77 : mid * 100.0 / hp) / 77 + 1;
                    max = calcSkillDamage(character, enemy, (40 + r * 30) * coe, 0.2 * coe, 1);
                    if (max * 4 + mid > hp + heal) {
                        end = mid - 1;
                    } else {
                        start = mid;
                    }
                }
                start = 0;
                end = (hp * 0.77 | 0) + 1;
                while (start < end) {
                    mid = (start + end + 1) / 2;
                    coe = 2 * (mid * 100.0 / hp > 77 ? 77 : mid * 100.0 / hp) / 77 + 1;
                    over = calcSkillDamage(character, enemy, (40 + r * 30) * coe * 1.19, 0.2 * coe * 1.19, 1);
                    if (max * 4 + mid > hp + heal) {
                        end = mid - 1;
                    } else {
                        start = mid;
                    }
                }
            } else {
                max = calcSkillDamage(character, enemy, 120 + r * 90, 0.6, 1);
                over = calcSkillDamage(character, enemy, 120 + r * 90 * 1.19, 0.6 * 1.19, 1);
            }
            return "<b class='damage'>" + min * 4 + ' ~ ' + max * 4 + '</b> / ' + over * 4 + ' ( [ ' + min + ' x 4 ] - [ ' + max + ' x 4 ] / [ ' + over + ' x 4 ] )';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Glove') {
                const coe = wm < 13 ? 1 : 2;
                const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                const damage = baseAttackDamage(character, enemy, 0, 1 + coe, character.critical_strike_chance, 1) + bonus;
                const min = baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                const max = baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                const over = baseAttackDamage(character, enemy, 0, (1 + coe) * 1.19, 100, 1) + bonus;
                const life = calcHeal(damage * (character.life_steal / 100), 1, enemy);
                return "<b class='damage'>" + damage + '</b> ( ' +  min + " - <b class='damage'>" + max + '</b> / ' + over + " )<b> __h: </b><b class='heal'>" + life + '</b>';
            }
            if (type === 'Nunchaku') {
                const min = calcSkillDamage(character, enemy, wm < 13 ? 150 : 300, 0.5, 1);
                const max = calcSkillDamage(character, enemy, wm < 13 ? 300 : 600, 1.5, 1);
                return "<b class='damage'>" + min + ' ~ ' + max + '</b>';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        if (character.weapon) {
            const coe = 0.5 + character.T_LEVEL.selectedIndex * 0.25;
            const damage1 = baseAttackDamage(character, enemy, 0, 1, character.critical_strike_chance, 1);
            const damage2 = baseAttackDamage(character, enemy, 0, coe, character.critical_strike_chance, 1);
            const min1 = baseAttackDamage(character, enemy, 0, 1, 0, 1);
            const min2 = baseAttackDamage(character, enemy, 0, coe, 0, 1);
            const max1 = baseAttackDamage(character, enemy, 0, 1, 100, 1);
            const max2 = baseAttackDamage(character, enemy, 0, coe, 100, 1);
            const over1 = baseAttackDamage(character, enemy, 0, 1.1, 100, 1);
            const over2 = baseAttackDamage(character, enemy, 0, coe * 1.1, 100, 1);
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' +  min1 + ', ' + min2 + ' - ' + max1 + ', ' + max2 + ' / ' + over1 + ', ' + over2 + ' ) ';
        }
        return '-';
    }
    ,T_Option: ''
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Glove' ? '글러브' : 
            weapon === 'Nunchaku' ? '쌍절곤' : 
            '';
        const skill = 
            weapon === 'Glove' ? '"평균 데미지" ( "평타 데미지" - "치명타 데미지" / "최대 강화 데미지" ) __h: "평균 흡혈량"' : 
            weapon === 'Nunchaku' ? '"최소 데미지" ~ "최대 데미지"' : 
            '';
        return '리 다이린 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "합산 강화 데미지" ( "1타 데미지", "2타 데미지", "3타 데미지" - "1타 강화", "2타 강화", "3타 강화" )\n' + 
            'W: _d/s: "만취 초당 데미지" __h/s: "만취 초당 흡혈량" __use "스킬 사용"\n' + 
            'E: "스킬 데미지"\n' + 
            'R: "최소 합산 데미지" ~ "최대 막타 데미지" / "최대 강화 데미지" ( [ "최소 데미지" x "타수" ] - [ "최대 데미지" x "타수" ] / [ "최대 강화 데미지" x "타수" ] )\n' + 
            'D: ' + skill + '\n' + 
            'T: "평균 데미지" ( "1타 데미지", "2타 데미지" - "1타 치명타", "2타 치명타" / "1타 최대 강화", "2타 최대 강화" )\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const e = character.E_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const t = character.T_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            let bac = 0, liquid = 0, qq = 0, wq = 0;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    if (liquid > 1) {
                        liquid = 1;
                        damage += baseAttackDamage(character, enemy, 0, 1 * (1 + bac * 0.002), 0, 1);
                    } else {
                        liquid = 0;
                        damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    }
                } else if (c === 'A') {
                    if (liquid > 1) {
                        liquid = 1;
                        damage += baseAttackDamage(character, enemy, 0, 1 * (1 + bac * 0.002), 100, 1);
                    } else {
                        liquid = 0;
                        damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    }
                } else if (c === 'q' || c === 'Q') {
                	if (liquid === 1) {
                    	liquid = 0;
                    }
                    if (qq > 0) {
                        qq--;
                        damage += calcSkillDamage(character, enemy, 20 + q * 20, 0.5, 1);
                    } else if (wq > 0) {
                        wq--;
                        damage += calcSkillDamage(character, enemy, 28 + q * 28, 0.7, 1);
                    } else if (bac >= 40) {
                        wq = 2;
                        damage += calcSkillDamage(character, enemy, 28 + q * 28, 0.7, 1);
                        bac -= 40;
                    } else {
                        qq = 2;
                        damage += calcSkillDamage(character, enemy, 20 + q * 20, 0.5, 1);
                    }
                } else if (c === 'w' || c === 'W') {
                    liquid = 2;
                    if (bac < 55) {
                        bac += 45;
                    } else {
                        bac = 95;
                    }
                } else if (c === 'e' || c === 'E') {
                	if (liquid === 1) {
                    	liquid = 0;
                    }
                    if (bac >= 40) {
                        bac -= 40;
                    }
                    damage += calcSkillDamage(character, enemy, 80 + e * 55, 0.5, 1)
                } else if (c === 'r' || c === 'R') {
                    let lost = enemy.max_hp ? damage - calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                        (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) * character.DIV.querySelector('.combo_time').value * (i / combo.length) : 0;
                    if (lost < 0) {
                        lost = 0;
                    }
                    const coe = enemy.max_hp ? 2 * (lost * 100.0 / enemy.max_hp > 77 ? 77 : lost * 100.0 / enemy.max_hp) / 77 + 1 : 3;
                    if (bac >= 40) {
                        if (liquid > 1) {
                            damage += calcSkillDamage(character, enemy, (40 + r * 30) * coe * (1 + bac * 0.002), 0.2 * coe * (1 + bac * 0.002), 1) * 4;
                        } else {
                            damage += calcSkillDamage(character, enemy, (40 + r * 30) * coe, 0.2 * coe, 1) * 4;
                        }
                        bac -= 40;
                    } else {
                        if (liquid > 1) {
                            damage += calcSkillDamage(character, enemy, (40 + r * 30) * coe * (1 + bac * 0.002), 0.2 * coe * (1 + bac * 0.002), 1) * 2;
                        } else {
                            damage += calcSkillDamage(character, enemy, (40 + r * 30) * coe, 0.2 * coe, 1) * 2;
                        }
                    }
                    liquid = 0;
                } else if (c === 'd') {
                    if (wm > 5) {
                        if (type === 'Glove') {
                            const coe = wm < 13 ? 1 : 2;
                            const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                            if (liquid) {
                                damage += baseAttackDamage(character, enemy, 0, (1 + coe) * (1 + bac * 0.002), 0, 1) + bonus;
                            } else {
                                damage += baseAttackDamage(character, enemy, 0, 1 + coe, 0, 1) + bonus;
                            }
                        	liquid = 0;
                        } else if (type === 'Nunchaku') {
                            if (liquid === 1) {
                            	liquid = 0;
                            }
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 150 : 300, 0.5, 1);
                        }
                    }
                } else if (c === 'D') {
                    if (wm > 5) {
                        if (type === 'Glove') {
                            const coe = wm < 13 ? 1 : 2;
                            const bonus = calcTrueDamage(character, enemy, wm < 13 ? 50 : 100);
                            if (liquid) {
                                liquid = 0;
                                damage += baseAttackDamage(character, enemy, 0, (1 + coe) * (1 + bac * 0.002), 100, 1) + bonus;
                            } else {
                                damage += baseAttackDamage(character, enemy, 0, 1 + coe, 100, 1) + bonus;
                            }
                        } else if (type === 'Nunchaku') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 300 : 600, 1.5, 1);
                        }
                    }
                } else if (c === 't') {
                    if (liquid) {
                        liquid = false;
                        damage += baseAttackDamage(character, enemy, 0, 1 * (1 + liquid * 0.002), 0, 1) + 
                            baseAttackDamage(character, enemy, 0, (0.5 + t * 0.25) * (1 + liquid * 0.002), 0, 1);
                    } else {
                        damage += baseAttackDamage(character, enemy, 0, 1, 0, 1) + 
                            baseAttackDamage(character, enemy, 0, (0.5 + t * 0.25), 0, 1);
                    }
                } else if (c === 'T') {
                    if (liquid) {
                        liquid = false;
                        damage += baseAttackDamage(character, enemy, 0, 1 * (1 + liquid * 0.002), 100, 1) + 
                            baseAttackDamage(character, enemy, 0, (0.5 + t * 0.25) * (1 + liquid * 0.002), 100, 1);
                    } else {
                        damage += baseAttackDamage(character, enemy, 0, 1, 100, 1) + 
                            baseAttackDamage(character, enemy, 0, (0.5 + t * 0.25), 100, 1);
                    }
                } else if (c === 'p' || c === 'P') {
                    if (character.trap) {
                        damage += character.trap.Trap_Damage * (1.04 + character.TRAP_MASTERY.selectedIndex * 0.04) | 0;
                    }
                }
            }
            const heal = enemy.hp_regen ? calcHeal(enemy.hp_regen * (enemy.hp_regen_percent + 100) / 100 + 
                (enemy.food ? enemy.food.HP_Regen / 30 : 0), 2, character) : 0;
            const percent = (enemy.max_hp ? ((damage - character.DIV.querySelector('.combo_time').value * heal) / enemy.max_hp  * 10000 | 0) / 100 : '-');
            return "<b class='damage'>" + damage + '</b><b> _ : ' + (percent < 0 ? 0 : percent) + '%</b>';
        }
        return '-';
    }
    ,COMBO_Option: 'wwqaDetwrt'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Glove' ? 'd: 무스 데미지\n' + 'D: 무스 치명타 데미지\n' : 
            weapon === 'Nunchaku' ? 'd: 무스 즉발 데미지\n' + 'D: 무스 최대 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 1회 데미지\n' + 
            'w & W: W스킬 사용(최대 게이지 95)\n' +  
            'e & E: E스킬 데미지\n' + 
            'r & R: R스킬 데미지(잃은 체력 비례)\n' + 
            't: 패시브 데미지\n' + 
            'T: 패시브 치명타 데미지\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
