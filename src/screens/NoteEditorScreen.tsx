import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/types/navigation';
import { useNotes, useCreateNote, useUpdateNote } from '@/api/notes.queries';
import { EnrichedTextInput, EnrichedTextInputInstance, OnChangeHtmlEvent, OnChangeSelectionEvent, OnChangeStateEvent, OnChangeTextEvent,} from 'react-native-enriched';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'NoteEditor'>;
type RouteProps = RouteProp<AppStackParamList, 'NoteEditor'>;

interface Selection {
  start: number;
  end: number;
  text: string;
}

const ANDROID_EXPERIMENTAL_SYNCHRONOUS_EVENTS = false;

export function NoteEditorScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const contentRef = useRef<EnrichedTextInputInstance>(null);
  const { noteId } = route.params || {};
  const isEditing = !!noteId;

  const { data: notes } = useNotes();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();

  const [title, setTitle] = useState('');
  const [contentStylesState, setContentStylesState] = useState<OnChangeStateEvent | null>();
  const [currentHtml, setCurrentHtml] = useState<string | null>("");
  const [selection, setSelection] = useState<Selection>();
  const [error, setError] = useState<string | null>(null);

  // Hydrate form if editing
  useEffect(() => {
    if (isEditing && notes) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setCurrentHtml(note.content);
      } else {
        // Handle case where note is not found (unlikely but possible)
        Alert.alert('Error', 'Note not found');
        navigation.goBack();
      }
    }
  }, [isEditing, noteId, notes, navigation]);

  const isLoading = createNoteMutation.isPending || updateNoteMutation.isPending;


    const handleChangeText = (e: OnChangeTextEvent) => {
    console.log('Text changed:', e.value);
  };

    const handleChangeHtml = (e: OnChangeHtmlEvent) => {
    console.log('HTML changed:', e.value);
    setCurrentHtml(e.value);
  };

    const handleChangeState = (state: OnChangeStateEvent) => {
    setContentStylesState(state);
  };

   const handleSelectionChangeEvent = (sel: OnChangeSelectionEvent) => {
    setSelection(sel);
  };

  const handleSave = () => {
    if (!title.trim() || !currentHtml?.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError(null);

    if (isEditing && noteId) {
      updateNoteMutation.mutate(
        { id: noteId, data: { title: title.trim(), content: currentHtml?.trim() } },
        {
          onSuccess: () => navigation.goBack(),
          onError: (err) => setError(err.message),
        }
      );
    } else {
      createNoteMutation.mutate(
        { title: title.trim(), content: currentHtml?.trim() },
        {
          onSuccess: () => navigation.goBack(),
          onError: (err) => setError(err.message),
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'New Note'}</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isLoading}
          style={[styles.saveButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          
          <View style={styles.editorContainer}>
             <EnrichedTextInput
                ref={contentRef}
                cursorColor="dodgerblue"
                autoCapitalize="sentences"
                onChangeText={(e) => handleChangeText(e.nativeEvent)}
                onChangeHtml={(e) => handleChangeHtml(e.nativeEvent)}
                onChangeState={(e) => handleChangeState(e.nativeEvent)}
                onChangeSelection={(e) => handleSelectionChangeEvent(e.nativeEvent)}
                placeholder="Start typing..."
                style={styles.editor}
                androidExperimentalSynchronousEvents={
                  ANDROID_EXPERIMENTAL_SYNCHRONOUS_EVENTS
                }
             />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}


          {/* <Button
            title={stylesState?.isBold ? 'Unbold' : 'Bold'}
            color={stylesState?.isBold ? 'green' : 'gray'}
            onPress={() => ref.current?.toggleBold()}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  editorContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    minHeight: 200,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%', 
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
