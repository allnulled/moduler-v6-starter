Calendar_parser = Sentence

Sentence = New_event_sentence

New_event_sentence = "ok" / Json_language / Duration_language

/*@injects:"@/src/candidate/Std/apis/calendar/CalendarParser/syntax/Json_language.pegjs"*/

/*@injects:"@/src/candidate/Std/apis/calendar/CalendarParser/syntax/Duration_language.pegjs"*/