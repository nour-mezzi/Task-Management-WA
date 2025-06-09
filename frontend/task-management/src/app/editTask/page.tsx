'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import '@/styles/auth.css';

import { useEditTaskFormStore } from '@/store/editTaskStore';

import { Task } from '@/types/task';


interface EditTaskFormProps {
    initialTaskData: Task;
    categories: { value: string; label: string; }[];
    onSave?: (updatedTask: Task) => void;
    onCancel?: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
    initialTaskData,
    categories,
    onSave,
    onCancel
}) => {
    const {
        taskId,
        taskTitle,
        selectedCategory,
        taskDescription,
        dueDate,
        isLoading,
        error,
        loadTaskForEditing,
        setTaskTitle,
        setSelectedCategory,
        setTaskDescription,
        setDueDate,
        resetForm,
        submitTaskUpdate,
        setError,
    } = useEditTaskFormStore(
        (state) => ({
            taskId: state.taskId,
            taskTitle: state.taskTitle,
            selectedCategory: state.selectedCategory,
            taskDescription: state.taskDescription,
            dueDate: state.dueDate,
            isLoading: state.isLoading,
            error: state.error,
            loadTaskForEditing: state.loadTaskForEditing,
            setTaskTitle: state.setTaskTitle,
            setSelectedCategory: state.setSelectedCategory,
            setTaskDescription: state.setTaskDescription,
            setDueDate: state.setDueDate,
            resetForm: state.resetForm,
            submitTaskUpdate: state.submitTaskUpdate,
            setError: state.setError,
        })
    );

    useEffect(() => {
        if (initialTaskData) {
           console.log("Loading initial task data into Zustand store:", initialTaskData);
           loadTaskForEditing(initialTaskData);
        }

        return () => {
            console.log("Cleaning up EditTaskForm state");
            resetForm();
        };

    }, [initialTaskData, loadTaskForEditing, resetForm]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
         setTaskDescription(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    }

     const handleDueDateChange = (date: Date | undefined) => {
        setDueDate(date);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        submitTaskUpdate(onSave);
    };

    const handleCancelClick = () => {
        resetForm();
        if (onCancel) {
            onCancel();
        }
    };

    const dueDateButtonClasses = cn(
        "w-full justify-start text-left font-normal",
        !dueDate && "text-muted-foreground"
    );


    return (
        <div className="split-layout-card-section">
            <Card className="w-full max-w-sm split-layout-the-card">
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                    <CardDescription>Modify task details and save changes</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
                    )}

                    {taskId ? (
                         <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-task-title">Task Title</Label>
                                    <Input
                                        id="edit-task-title"
                                        type="text"
                                        placeholder="e.g., Buy groceries"
                                        required
                                        value={taskTitle}
                                        onChange={handleTitleChange}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-task-category">Category</Label>
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={handleCategoryChange}
                                        required
                                    >
                                        <SelectTrigger id="edit-task-category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-task-description">Description (Optional)</Label>
                                    <Textarea
                                        id="edit-task-description"
                                        placeholder="Add details about the task..."
                                        value={taskDescription}
                                        onChange={handleDescriptionChange}
                                    />
                                </div>

                                 <div className="grid gap-2">
                                    <Label htmlFor="edit-task-due-date">Due Date (Optional)</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={dueDateButtonClasses}
                                                disabled={isLoading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={handleDueDateChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                            </div>
                             <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                                {onCancel && (
                                    <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isLoading}>
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <p className="p-4 text-center text-gray-500">Loading task data...</p>
                    )}

                </CardContent>
            </Card>
        </div>
    );
};

export default EditTaskForm;