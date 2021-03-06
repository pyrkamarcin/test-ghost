function generate_mod(ability) {
    if (ability > 0) {
        return Math.floor((ability - 10) / 2)
    } else {
        return null
    }
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

$(document).ready(function() {

    // $.getJSON("api/Characters/1", function(data) {
    //     $('#inputCharacterName').val(data.name)
    //     $('#inputCharacterClasses').val(data.classes)
    //     $('#inputCharacterLevel').val(data.level)
    //     $('#inputCharacterRace').val(data.race)
    //     $('#inputCharacterCharacter').val(data.chatacter)
    //     $('#inputCharacterSex').val(data.sex)
    // });

    // $.getJSON("api/Abilities", function(data) {
    //     for (i = 0; i < data.length; i++) {
    //         $('.input_abilities_' + data[i].name).children().find('.input-value-1').val(data[i].value1)
    //         $('.input_abilities_' + data[i].name).children().find('.input-value-1').change()
    //         $('.input_abilities_' + data[i].name).children().find('.input-value-3').val(data[i].value3)
    //         $('.input_abilities_' + data[i].name).children().find('.input-value-3').change()
    //     }
    // })

    // $.getJSON("api/Skills", function(data) {
    //     for (i = 0; i < data.length; i++) {
    //         $(document).find('.input_skills').find('.inputSkillValue3_' + data[i].code).val(data[i].value3)
    //         $(document).find('.input_skills').find('.inputSkillValue3_' + data[i].code).change()
    //         $(document).find('.input_skills').find('.inputSkillValue4_' + data[i].code).val(data[i].value4)
    //         $(document).find('.input_skills').find('.inputSkillValue4_' + data[i].code).change()
    //     }
    // })

    $('.inputCharacter').find('.form-control').bind('change', function() {
        $.post("api/character/single", {
            id: 1,
            name: $(this).attr('field_data_name'),
            value: $(this).val()
        })
    })

    $('.input-value-1').bind('change', function() {
        $(this).parents('.input_abilities').children().find('.input-value-2').val(generate_mod($(this).val()))

        if ($(this).parents('.input_abilities').children().find('.input-value-3').val() > 0) {
            $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).val($(this).parents('.input_abilities').children().find('.input-value-4').val())
        } else {
            $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).val($(this).parents('.input_abilities').children().find('.input-value-2').val())
        }
        $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).change()
    });

    $('.input-value-3').bind('change', function() {
        $(this).parents('.input_abilities').children().find('.input-value-4').val(generate_mod($(this).val()))

        if ($(this).parents('.input_abilities').children().find('.input-value-3').val() > 0) {
            $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).val($(this).parents('.input_abilities').children().find('.input-value-4').val())
        } else {
            $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).val($(this).parents('.input_abilities').children().find('.input-value-2').val())
        }

        $(document).find('.input_skills').find('.input-ability-' + $(this).parents('.input_abilities').children().find('.input-name').text()).change()
    })

    $('.input-value-2, .input-value-3, .input-value-4').bind('change', function() {
        let ability = $(this).parents('.input_skills').children().find('.input-value-2').val()
        let range = $(this).parents('.input_skills').children().find('.input-value-3').val()
        let additional = $(this).parents('.input_skills').children().find('.input-value-4').val()

        $(this).parents('.input_skills').children().find('.input-value-1').val(
            Math.floor(ability / 1 + range / 1 + additional / 1)
        )
    })

    $('.input-value-1, .input-value-2, .input-value-3, .input-value-4').trigger('change')
})