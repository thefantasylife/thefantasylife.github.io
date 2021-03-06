const Hyejin = {
     Attack_Power: 29
    ,Attack_Power_Growth: 2.5
    ,Health: 500
    ,Health_Growth: 64
    ,Health_Regen: 0.6
    ,Health_Regen_Growth: 0.03
    ,Stamina: 400
    ,Stamina_Growth: 26
    ,Stamina_Regen: 2
    ,Stamina_Regen_Growth: 0.08
    ,Defense: 22
    ,Defense_Growth: 1.7
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Shuriken, Bow]
    ,correction: {
        Shuriken: [
            [12, 5, 0],
            [-10, -7, -7]
        ],
        Bow: [
            [0, -13, -18],
            [-6, -3, -3]
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
            const damage = calcSkillDamage(character, enemy, 100 + character.Q_LEVEL.selectedIndex * 25, 0.4, 1);
            const cool = 10000 / ((20 - q * 3) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + damage + "</b><b> __sd/s: </b><b class='damage'>" + round(damage * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const min = calcSkillDamage(character, enemy, 15 + w * 5, 0.5, 1);
            const max = calcSkillDamage(character, enemy, 140 + w * 65, 0.5, 1);
            const cool = 10000 / ((22 - w * 3) * (100 - character.cooldown_reduction));
            return "<b class='damage'>" + min + ' ~ ' + max + "</b><b> __sd/s: </b><b class='damage'>" + round(min * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        if (character.weapon) {
            const e = character.E_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 45 + e * 25, 0.3, 1);
            const damage2 = calcSkillDamage(character, enemy, 50 + e * 25, 0.5, 1);
            const cool = 10000 / (12 * (100 - character.cooldown_reduction) + 50);
            return "<b class='damage'>" + (damage1 + damage2) + '</b> ( ' + damage1 + ', ' + damage2 + " )<b> __sd/s: </b><b class='damage'>" + round((damage1 + damage2) * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,E_Option: ''
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            const r = character.R_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 150 + r * 125, 0.7, 1);
            const damage2 = calcSkillDamage(character, enemy, 80 + r * 50, 0.5, 1);
            return "<b class='damage'>" + (damage1 + damage2 * 5) + '</b> ( ' + damage1 + ', ' + damage2 + ' x 5 )';
        }
        return '-';
    }
    ,R_Option: ''
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Shuriken') {
                const damage = calcSkillDamage(character, enemy, wm < 13 ? 110 : 180, 0.3, 1);
                const add = calcSkillDamage(character, enemy, (wm < 13 ? 110 : 180) * 0.3, 0.3 * 0.3, 1);
                return "<b class='damage'>" + damage + ' ~ ' + (damage + add * 11) + '</b> ( ' + damage + ', ' + add + ' x 11 )';
            }
            if (type === 'Bow') {
                const min = calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                const max = calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                return "<b class='damage'>" + min + ' - ' + max + '</b>';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
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
            weapon === 'Shuriken' ? '암기' : 
            weapon === 'Bow' ? '보우' : 
            '';
        const skill = 
            weapon === 'Shuriken' ? '"1타 데미지" ~ "합산 데미지" ( "1타 데미지", "추가 데미지" x "타수" )' : 
            weapon === 'Bow' ? '"최소 데미지" - "최대 데미지"' : 
            '';
        return '혜진 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "스킬 데미지"\n' + 
            'W: "최소 데미지" ~ "최대 데미지"\n' + 
            'E: "합산 데미지" ( "1타 데미지", "2타 데미지" )\n' + 
            'R: "합산 데미지" ( "폭발 데미지", "구체 데미지" x "타수" )\n' + 
            'D: ' + skill + '\n' + 
            'T: "데미지 없음"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const w = character.W_LEVEL.selectedIndex;
            const e = character.E_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            let ee = false;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                } else if (c === 'q' || c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 100 + q * 25, 0.4, 1);
                } else if (c === 'w') {
                    damage += calcSkillDamage(character, enemy, 15 + w * 5, 0.5, 1);
                } else if (c === 'W') {
                    damage += calcSkillDamage(character, enemy, 140 + w * 65, 0.5, 1);
                } else if (c === 'e' || c === 'E') {
                    if (ee) {
                        ee = false;
                        damage += calcSkillDamage(character, enemy, 50 + e * 25, 0.5, 1);
                    } else {
                        ee = true;
                        damage += calcSkillDamage(character, enemy, 45 + e * 25, 0.3, 1);
                    }
                } else if (c === 'r') {
                    damage += calcSkillDamage(character, enemy, 80 + r * 50, 0.5, 1);
                } else if (c === 'R') {
                    damage += calcSkillDamage(character, enemy, 150 + r * 125, 0.7, 1);
                } else if (c === 'd') {
                    if (wm > 5) {
                        if (type === 'Shuriken') {
                            damage += calcSkillDamage(character, enemy, (wm < 13 ? 110 : 180) * 0.3, 0.3 * 0.3, 1);
                        } else if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                        }
                    }
                } else if (c === 'D') {
                    if (wm > 5) {
                        if (type === 'Shuriken') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 110 : 180, 0.3, 1);
                        } else if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                        }
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
    ,COMBO_Option: 'qweaeRrqdara'
    ,COMBO_Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const d = 
            weapon === 'Shuriken' ? 'd: 무스 추가타 데미지\n' + 'D: 무스 첫타 데미지\n' : 
            weapon === 'Bow' ? 'd: 무스 외곽 데미지\n' + 'D: 무스 중앙 데미지\n' : 
            '';
        return 'a: 기본공격 데미지\n' + 
            'A: 치명타 데미지\n' +
            'q & Q: Q스킬 데미지\n' + 
            'w: W스킬 즉발 데미지\n' +  
            'w: W스킬 최대 데미지\n' +  
            'e & E: E스킬 1타 데미지, 재사용시 2타 데미지\n' + 
            'r: R스킬 구체 데미지\n' + 
            'R: R스킬 폭발 데미지\n' + 
            't & T: 데미지 없음\n' + 
            d + 
            'p & P: 트랩 데미지';
    }
};
