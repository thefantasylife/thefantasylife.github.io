const Nadine = {
     Attack_Power: 32
    ,Attack_Power_Growth: 2.2
    ,Health: 520
    ,Health_Growth: 60
    ,Health_Regen: 0.4
    ,Health_Regen_Growth: 0.03
    ,Stamina: 350
    ,Stamina_Growth: 13
    ,Stamina_Regen: 1.9
    ,Stamina_Regen_Growth: 0.05
    ,Defense: 21
    ,Defense_Growth: 1.5
    ,Atk_Speed: 0.12
    ,Crit_Rate: 0
    ,Move_Speed: 3
    ,Sight_Range: 8
    ,Attack_Range: 0.4
    ,weapons: [Bow, Crossbow]
    ,correction: {
        Bow: [
            [0, -11, -17],
            [0, 0, 0]
        ],
        Crossbow: [
            [0, -9, -17],
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
            const life = calcHeal(ba * (character.life_steal / 100), character.attack_speed, enemy);
            let damage;
            if (character.DIV.querySelector('.nadine_r').checked) {
                const bonus = calcSkillDamage(character, enemy, 50 + character.R_LEVEL.selectedIndex * 50 + parseInt(character.DIV.querySelector('.nadine_t').value), 0.5, 1) / 3;
                damage = round((ba + bonus) * character.attack_speed * 100) / 100;
            } else {
                damage = round(ba * character.attack_speed * 100) / 100;
            }
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
            const stack = parseInt(character.DIV.querySelector('.nadine_t').value);
            const min = calcSkillDamage(character, enemy, 70 + q * 45 + stack, 0.6, 1);
            const max = calcSkillDamage(character, enemy, 140 + q * 90 + stack, 1.2, 1);
            const cool = 10000 / (7 * (100 - character.cooldown_reduction) + 200);
            return "<b class='damage'>" + min + ' ~ ' + max + "</b><b> __sd/s: </b><b class='damage'>" + round(max * cool) / 100 + '</b>';
        }
        return '-';
    }
    ,Q_Option: ''
    ,W_Skill: (character, enemy) => {
        if (character.weapon) {
            const w = character.W_LEVEL.selectedIndex;
            const damage1 = calcSkillDamage(character, enemy, 100 + w * 70, 0.6, 1);
            const damage2 = calcSkillDamage(character, enemy, 100 + w * 40, 0.6, 1);
            return "<b class='damage'>" + (damage1 * 2 + damage2) + '</b> ( ' + damage1 + ', ' + damage1 + ", <b class='damage'>" +  + damage2 + '</b> )';
        }
        return '-';
    }
    ,W_Option: ''
    ,E_Skill: (character, enemy) => {
        return '';
    }
    ,E_Option: "<b> _use</b><input type='checkbox' class='nadine_e' onchange='updateDisplay()'>"
    ,R_Skill: (character, enemy) => {
        if (character.weapon) {
            return "<b class='damage'>" + calcSkillDamage(character, enemy, 50 + character.R_LEVEL.selectedIndex * 50 + parseInt(character.DIV.querySelector('.nadine_t').value), 0.5, 1) + '</b>';
        }
        return '-';
    }
    ,R_Option: "<b> _use</b><input type='checkbox' class='nadine_r' onchange='updateDisplay()'>"
    ,D_Skill: (character, enemy) => {
        const wm = character.WEAPON_MASTERY.selectedIndex;
        if (character.weapon && wm > 5) {
            const type = character.weapon.Type;
            if (type === 'Bow') {
                const min = calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                const max = calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                return "<b class='damage'>" + min + ' - ' + max + '</b>';
            }
            if (type === 'Crossbow') {
                const damage = calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1);
                return "<b class='damage'>" + damage * 2 + '</b> ( ' + damage + ', ' + damage + ' )';
            }
        }
        return '-';
    }
    ,D_Option: (character, enemy) => {
        return '';
    }
    ,T_Skill: (character, enemy) => {
        return '';
    }
    ,T_Option: "<input type='number' class='stack nadine_t' value='0' onchange='fixLimitNum(this, 999)'><b>Stack"
    ,Help: (character) => {
        if (!character.character) {
            return 'select character plz';
        }
        if (!character.weapon) {
            return 'select weapon plz';
        }
        const weapon = character.weapon.Type;
        const type = 
            weapon === 'Bow' ? '활' : 
            weapon === 'Crossbow' ? '석궁' : 
            '';
        const skill = 
            weapon === 'Bow' ? '"최소 데미지" - "최대 데미지"' : 
            weapon === 'Crossbow' ? '"합산 데미지" ( "1타 데미지", "벽꿍 데미지" )' : 
            '';
        return '나딘 ( ' + type + ' )\n' + 
            'A: "평균 데미지" ( "평타 데미지" - "치명타 데미지" )\n' + 
            'DPS: "초당 데미지" __h/s: "초당 흡혈량"\n' + 
            'HPS: "초당 회복량"\n' + 
            'Q: "최소 데미지" ~ "최대 데미지"\n' + 
            'W: "합산 데미지" ( "1타 데미지", "2타 데미지", "덫 데미지" )\n' + 
            'E: _use "스킬 사용"\n' + 
            'R: "스킬 데미지" _use "스킬 사용"\n' + 
            'D: ' + skill + '\n' + 
            'T: "스택"\n';
    }
    ,COMBO: (character, enemy) => {
        if (character.weapon) {
            const type = character.weapon.Type;
            const q = character.Q_LEVEL.selectedIndex;
            const w = character.W_LEVEL.selectedIndex;
            const r = character.R_LEVEL.selectedIndex;
            const wm = character.WEAPON_MASTERY.selectedIndex;
            let damage = 0, c;
            const stack = parseInt(character.DIV.querySelector('.nadine_t').value);
            let rr = 0;
            const combo = character.COMBO_OPTION.value;
            for (let i = 0; i < combo.length; i++) {
                c = combo.charAt(i);
                if (c === 'a') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 0, 1);
                    if (rr === 3) {
                        rr = 1;
                        damage += calcSkillDamage(character, enemy, 50 + r * 50 + stack, 0.5, 1);
                    } else if (rr) {
                        rr++;
                    }
                } else if (c === 'A') {
                    damage += baseAttackDamage(character, enemy, 0, 1, 100, 1);
                    if (rr === 3) {
                        rr = 1;
                        damage += calcSkillDamage(character, enemy, 50 + r * 50 + stack, 0.5, 1);
                    } else if (rr) {
                        rr++;
                    }
                } else if (c === 'q') {
                    damage += calcSkillDamage(character, enemy, 70 + q * 45 + stack, 0.6, 1)
                } else if (c === 'Q') {
                    damage += calcSkillDamage(character, enemy, 140 + q * 90 + stack, 1.2, 1);
                } else if (c === 'w') {
                    damage += calcSkillDamage(character, enemy, 100 + w * 40, 0.6, 1);
                } else if (c === 'W') {
                    damage += calcSkillDamage(character, enemy, 100 + w * 70, 0.6, 1);
                } else if (c === 'r' || c === 'R') {
                    if (rr) {
                        rr = 0;
                    } else {
                        rr = 3;
                    }
                } else if (c === 'd') {
                    if (wm > 5) {
                        if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 150 : 250, 1, 1);
                        } else if (type === 'Crossbow') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1);
                        }
                    }
                } else if (c === 'D') {
                    if (wm > 5) {
                        if (type === 'Bow') {
                            damage += calcSkillDamage(character, enemy, wm < 13 ? 300 : 500, 2, 1);
                        } else if (type === 'Crossbow') {
                            damage += calcSkillDamage(character, enemy, 0, wm < 13 ? 0.6 : 1, 1) * 2;
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
};